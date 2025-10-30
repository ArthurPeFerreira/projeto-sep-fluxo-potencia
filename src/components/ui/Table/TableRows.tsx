"use client";

import { cn } from "@/lib/utils/utils";
import { useTableContext } from "./TableRoot";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { Checkbox } from "../Checkbox";
import { Button } from "../Button";
import { FaSort, FaSortDown, FaSortUp, FaGripVertical } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow<T = any>({
  row,
  actualIndex,
}: {
  row: T;
  index: number;
  actualIndex: number;
}) {
  const {
    columns,
    selectable,
    selectedRows,
    onRowClick,
    onSelectionChange,
    setState,
    dragHandleColumn,
  } = useTableContext<T>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: (row as any).id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }

    if (selectable && onSelectionChange) {
      const isSelected = selectedRows.includes(row);
      const newSelectedRows = isSelected
        ? selectedRows.filter((r: T) => r !== row)
        : [...selectedRows, row];

      setState((prev) => ({ ...prev, selectedRows: newSelectedRows }));
      onSelectionChange(newSelectedRows);
    }
  };

  const modifiedColumns = columns
    .filter((column) => {
      if (column.visible === undefined) return true;
      if (typeof column.visible === "boolean") return column.visible;
      if (typeof column.visible === "function") return column.visible(row);
      return true;
    })
    .map((column) => {
      if (String(column.key) === dragHandleColumn) {
        return {
          ...column,
          render: () => (
            <div className="flex items-center justify-center">
              <div
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                {...attributes}
                {...listeners}
              >
                <FaGripVertical size={16} />
              </div>
            </div>
          ),
        };
      }
      return column;
    });

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "hover:bg-primary/10 transition-colors duration-500",
        onRowClick && "cursor-pointer"
      )}
      onClick={() => handleRowClick(row, actualIndex)}
      data-id={(row as any).id}
    >
      {selectable && (
        <td className="w-12 px-4 py-3">
          <Checkbox
            size="sm"
            variant="primary"
            checked={selectedRows.includes(row)}
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.checked) {
                const newSelectedRows = [...selectedRows, row];
                setState((prev) => ({
                  ...prev,
                  selectedRows: newSelectedRows,
                }));
                onSelectionChange?.(newSelectedRows);
              } else {
                const newSelectedRows = selectedRows.filter(
                  (r: T) => r !== row
                );
                setState((prev) => ({
                  ...prev,
                  selectedRows: newSelectedRows,
                }));
                onSelectionChange?.(newSelectedRows);
              }
            }}
          />
        </td>
      )}
      {modifiedColumns.map((column, index) => (
        <td
          key={String(column.key)}
          className={cn(
            "px-4 py-3 text-sm",
            column.align === "center" && "text-center",
            column.align === "right" && "text-right"
          )}
        >
          {column.render
            ? column.render(column.key, row, index)
            : (row as any)[column.key]}
        </td>
      ))}
    </tr>
  );
}

export function TableRows<T = any>() {
  const {
    columns,
    actions,
    sortedData,
    data,
    emptyMessage,
    selectable,
    selectedRows,
    sortConfig,
    handleSort,
    onRowClick,
    selectedRow,
    onSelectionChange,
    setState,
    state,
    loading,
    draggable,
    isDragging,
    pagination,
    draggedItemPosition,
  } = useTableContext<T>();

  const { currentPage, itemsPerPage } = state;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayData = isDragging
    ? (() => {
        const hasSearch = state.searchTerm.trim() !== "";
        const hasSort = state.sortConfig !== null;

        if (hasSearch && !hasSort) {
          if (
            draggedItemPosition !== null &&
            draggedItemPosition !== undefined &&
            draggedItemPosition >= 0
          ) {
            const draggedItem = sortedData[draggedItemPosition];
            if (draggedItem) {
              const otherItems = data.filter(
                (item: T) => (item as any).id !== (draggedItem as any).id
              );
              const result = [...otherItems];
              result.splice(draggedItemPosition, 0, draggedItem);
              return result;
            }
          }
          return data;
        } else if (hasSearch && hasSort) {
          if (
            draggedItemPosition !== null &&
            draggedItemPosition !== undefined &&
            draggedItemPosition >= 0
          ) {
            const draggedItem = sortedData[draggedItemPosition];
            if (draggedItem) {
              const sortedWithoutFilter = [...data].sort((a, b) => {
                const sortKey = state.sortConfig!.key;
                const column = columns.find(
                  (c) => String(c.key) === String(sortKey)
                );

                const getComparableValue = (row: any) => {
                  try {
                    if (column?.searchValue) {
                      const v = column.searchValue(row);
                      return v == null ? "" : String(v).toLowerCase();
                    }

                    const v = row?.[column?.key as any];
                    if (v == null) return "";
                    if (typeof v === "string") return v.toLowerCase();
                    if (typeof v === "number") return v;
                    if (typeof v === "boolean") return v ? 1 : 0;
                    if (v instanceof Date) return v.getTime();
                    return String(v).toLowerCase();
                  } catch {
                    return "";
                  }
                };

                const aValue = getComparableValue(a);
                const bValue = getComparableValue(b);

                if (typeof aValue === "string" && typeof bValue === "string") {
                  const cmp = aValue.localeCompare(bValue);
                  return state.sortConfig!.direction === "asc" ? cmp : -cmp;
                }

                if (aValue < bValue) {
                  return state.sortConfig!.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                  return state.sortConfig!.direction === "asc" ? 1 : -1;
                }
                return 0;
              });

              const otherItems = sortedWithoutFilter.filter(
                (item: T) => (item as any).id !== (draggedItem as any).id
              );
              const result = [...otherItems];
              result.splice(draggedItemPosition, 0, draggedItem);
              return result;
            }
          }
          return [...data].sort((a, b) => {
            const sortKey = state.sortConfig!.key;
            const column = columns.find(
              (c) => String(c.key) === String(sortKey)
            );

            const getComparableValue = (row: any) => {
              try {
                if (column?.searchValue) {
                  const v = column.searchValue(row);
                  return v == null ? "" : String(v).toLowerCase();
                }

                const v = row?.[column?.key as any];
                if (v == null) return "";
                if (typeof v === "string") return v.toLowerCase();
                if (typeof v === "number") return v;
                if (typeof v === "boolean") return v ? 1 : 0;
                if (v instanceof Date) return v.getTime();
                return String(v).toLowerCase();
              } catch {
                return "";
              }
            };

            const aValue = getComparableValue(a);
            const bValue = getComparableValue(b);

            if (typeof aValue === "string" && typeof bValue === "string") {
              const cmp = aValue.localeCompare(bValue);
              return state.sortConfig!.direction === "asc" ? cmp : -cmp;
            }

            if (aValue < bValue) {
              return state.sortConfig!.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
              return state.sortConfig!.direction === "asc" ? 1 : -1;
            }
            return 0;
          });
        } else if (hasSort) {
          return sortedData;
        }

        return sortedData;
      })()
    : draggable
    ? sortedData
    : pagination
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="w-4 h-4 opacity-30" />;
    }

    return sortConfig.direction === "asc" ? (
      <FaSortUp className="w-4 h-4" />
    ) : (
      <FaSortDown className="w-4 h-4" />
    );
  };

  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }

    if (selectable && onSelectionChange) {
      const isSelected = selectedRows.includes(row);
      const newSelectedRows = isSelected
        ? selectedRows.filter((r: T) => r !== row)
        : [...selectedRows, row];

      setState((prev) => ({ ...prev, selectedRows: newSelectedRows }));
      onSelectionChange(newSelectedRows);
    }
  };

  const setSelectedRows = (rows: T[]) => {
    setState((prev) => ({ ...prev, selectedRows: rows }));
  };

  return (
    <div className="overflow-x-auto rounded-xl border" data-table-container>
      <table className="w-full">
        <thead className="border-b">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox
                  size="sm"
                  variant="primary"
                  checked={
                    selectedRows.length === displayData.length &&
                    displayData.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(displayData);
                      onSelectionChange?.(displayData);
                    } else {
                      setSelectedRows([]);
                      onSelectionChange?.([]);
                    }
                  }}
                />
              </th>
            )}
            {columns
              .filter((column) => {
                if (column.visible === undefined) return true;
                if (typeof column.visible === "boolean") return column.visible;
                return true;
              })
              .map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium",
                    column.width && `w-${column.width}`,
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.sortable &&
                      "cursor-pointer transition-colors duration-500"
                  )}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                >
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end"
                    )}
                  >
                    <span>{column.title}</span>
                    {column.sortable && renderSortIcon(String(column.key))}
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-8 text-center"
              >
                <LoadingIcon />
              </td>
            </tr>
          ) : displayData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-8 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            displayData.map((row, index) => {
              const actualIndex =
                isDragging || draggable
                  ? index
                  : pagination
                  ? startIndex + index
                  : index;

              if (draggable) {
                return (
                  <SortableRow
                    key={(row as any).id}
                    row={row}
                    index={index}
                    actualIndex={actualIndex}
                  />
                );
              }

              return (
                <tr
                  key={actualIndex}
                  className={cn(
                    "hover:bg-primary/10 transition-colors duration-500",
                    onRowClick && "cursor-pointer",
                    selectedRow === row && "bg-primary/10",
                    selectedRows.includes(row) && "bg-primary/10"
                  )}
                  onClick={() => handleRowClick(row, actualIndex)}
                  data-id={(row as any).id}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-3">
                      <Checkbox
                        size="sm"
                        variant="primary"
                        checked={selectedRows.includes(row)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            const newSelectedRows = [...selectedRows, row];
                            setSelectedRows(newSelectedRows);
                            onSelectionChange?.(newSelectedRows);
                          } else {
                            const newSelectedRows = selectedRows.filter(
                              (r: T) => r !== row
                            );
                            setSelectedRows(newSelectedRows);
                            onSelectionChange?.(newSelectedRows);
                          }
                        }}
                      />
                    </td>
                  )}
                  {columns
                    .filter((column) => {
                      if (column.visible === undefined) return true;
                      if (typeof column.visible === "boolean")
                        return column.visible;
                      if (typeof column.visible === "function")
                        return column.visible(row);
                      return true;
                    })
                    .map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-4 py-3 text-sm",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.key === "actions" ? (
                          <div className="flex items-center gap-2">
                            {actions?.map((action) => {
                              if (action.hidden && action.hidden(row)) {
                                return null;
                              }

                              const isDisabled =
                                action.disabled && action.disabled(row);

                              return (
                                <Button
                                  key={action.key}
                                  variant={action.variant || "default"}
                                  disabled={isDisabled}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row, actualIndex);
                                  }}
                                  className={cn(
                                    action.size === "sm" && "py-1 px-2 text-xs",
                                    action.size === "lg" &&
                                      "py-3 px-6 text-base"
                                  )}
                                >
                                  {action.icon}
                                  {action.label}
                                </Button>
                              );
                            })}
                          </div>
                        ) : column.render ? (
                          column.render(
                            (row as any)[column.key],
                            row,
                            actualIndex
                          )
                        ) : (
                          (row as any)[column.key] || "-"
                        )}
                      </td>
                    ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
