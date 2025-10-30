"use client";

import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { cn } from "@/lib/utils/utils";
import { TableProps, TableState, TableContextValue } from "./types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext<T = any>(): TableContextValue<T> {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a Table.Root");
  }
  return context as TableContextValue<T>;
}

export function TableRoot<T = any>({
  columns,
  data,
  actions,
  loading = false,
  emptyMessage = "Nenhum dado encontrado",
  className,
  onRowClick,
  selectedRow,
  selectable = false,
  onSelectionChange,
  draggable = false,
  onOrderChange,
  dragHandleColumn = "drag",
  pagination = true,
  children,
}: TableProps<T> & { children?: ReactNode }) {
  const [state, setState] = useState<TableState<T>>({
    currentPage: 1,
    itemsPerPage: 10,
    sortConfig: null,
    selectedRows: [],
    searchTerm: "",
  });

  const [orderedData, setOrderedData] = useState<T[]>(data);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemPosition, setDraggedItemPosition] = useState<number | null>(
    null
  );
  const [draggedItemOriginalIndex, setDraggedItemOriginalIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setIsDragging(true);
    const draggedId = event.active.id;
    const hasSearch = state.searchTerm.trim() !== "";
    const hasSort = state.sortConfig !== null;

    if (hasSearch && !hasSort) {
      const filteredPosition = sortedData.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemPosition(filteredPosition);

      const originalPosition = data.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemOriginalIndex(originalPosition);
    } else if (hasSearch && hasSort) {
      const filteredPosition = sortedData.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemPosition(filteredPosition);

      const originalPosition = data.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemOriginalIndex(originalPosition);
    } else if (hasSort) {
      const sortedPosition = sortedData.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemPosition(sortedPosition);

      const originalPosition = data.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemOriginalIndex(originalPosition);
    } else {
      const orderedPosition = orderedData.findIndex(
        (item: T) => (item as any).id === draggedId
      );
      setDraggedItemPosition(orderedPosition);
      setDraggedItemOriginalIndex(orderedPosition);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    const originalDraggedIndex = draggedItemOriginalIndex;
    setDraggedItemPosition(null);
    setDraggedItemOriginalIndex(null);

    if (!over) return;

    const hasSearch = state.searchTerm.trim() !== "";
    const hasSort = state.sortConfig !== null;

    if (hasSearch && !hasSort) {
      const targetIndexInFull = data.findIndex(
        (item: T) => (item as any).id === over.id
      );

      if (
        originalDraggedIndex !== null &&
        originalDraggedIndex !== undefined &&
        targetIndexInFull !== -1
      ) {
        const items = [...data];
        const [draggedItem] = items.splice(originalDraggedIndex, 1);
        items.splice(targetIndexInFull, 0, draggedItem);
        setOrderedData(items);
        onOrderChange?.(items);

        if (pagination) {
          const targetPage = Math.ceil(
            (targetIndexInFull + 1) / state.itemsPerPage
          );
          setState((prev) => ({
            ...prev,
            searchTerm: "",
            sortConfig: null,
            currentPage: targetPage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            searchTerm: "",
            sortConfig: null,
            currentPage: 1,
          }));
        }
      }
    } else if (hasSearch && hasSort) {
      const targetIndexInSorted = sortedData.findIndex(
        (item: T) => (item as any).id === over.id
      );

      if (
        originalDraggedIndex !== null &&
        originalDraggedIndex !== undefined &&
        targetIndexInSorted !== -1
      ) {
        const sortedWithoutFilter = [...data].sort((a, b) => {
          const sortKey = state.sortConfig!.key;
          const column = columns.find((c) => String(c.key) === String(sortKey));

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

        const oldIndexInComplete = sortedWithoutFilter.findIndex(
          (item: T) => (item as any).id === active.id
        );
        const newIndexInComplete = sortedWithoutFilter.findIndex(
          (item: T) => (item as any).id === over.id
        );

        if (oldIndexInComplete !== -1 && newIndexInComplete !== -1) {
          const items = [...sortedWithoutFilter];
          const [draggedItem] = items.splice(oldIndexInComplete, 1);
          items.splice(newIndexInComplete, 0, draggedItem);
          setOrderedData(items);
          onOrderChange?.(items);

          if (pagination) {
            const targetPage = Math.ceil(
              (newIndexInComplete + 1) / state.itemsPerPage
            );
            setState((prev) => ({
              ...prev,
              searchTerm: "",
              sortConfig: null,
              currentPage: targetPage,
            }));
          } else {
            setState((prev) => ({
              ...prev,
              searchTerm: "",
              sortConfig: null,
              currentPage: 1,
            }));
          }
        }
      }
    } else if (hasSort) {
      const oldIndex = sortedData.findIndex(
        (item: T) => (item as any).id === active.id
      );
      const newIndex = sortedData.findIndex(
        (item: T) => (item as any).id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sortedData, oldIndex, newIndex) as T[];
        setOrderedData(newOrder);
        onOrderChange?.(newOrder);

        if (pagination) {
          const targetPage = Math.ceil((newIndex + 1) / state.itemsPerPage);
          setState((prev) => ({
            ...prev,
            sortConfig: null,
            currentPage: targetPage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            sortConfig: null,
            currentPage: 1,
          }));
        }
      }
    } else {
      const oldIndex = orderedData.findIndex(
        (item: T) => (item as any).id === active.id
      );
      const newIndex = orderedData.findIndex(
        (item: T) => (item as any).id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(orderedData, oldIndex, newIndex) as T[];
        setOrderedData(newOrder);
        onOrderChange?.(newOrder);

        if (pagination) {
          const targetPage = Math.ceil((newIndex + 1) / state.itemsPerPage);
          setState((prev) => ({
            ...prev,
            sortConfig: null,
            currentPage: targetPage,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            sortConfig: null,
            currentPage: 1,
          }));
        }
      }
    }

    setTimeout(() => {
      const element = document.querySelector(`[data-id="${over.id}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const filteredData = useMemo(() => {
    const sourceData = draggable ? orderedData : data;

    if (!state.searchTerm) return sourceData;

    return sourceData.filter((item: T) => {
      const searchLower = state.searchTerm.toLowerCase();

      return columns
        .filter((col) => col.searchable)
        .some((column) => {
          if (column.searchValue) {
            return column.searchValue(item).toLowerCase().includes(searchLower);
          }
          const value = (item as any)[column.key];
          return String(value).toLowerCase().includes(searchLower);
        });
    });
  }, [data, orderedData, state.searchTerm, columns, draggable]);

  const sortedData = useMemo(() => {
    if (!state.sortConfig) return filteredData;

    const sortKey = state.sortConfig.key;
    const column = columns.find((c) => String(c.key) === String(sortKey));

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

    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, state.sortConfig, columns]);

  const totalPages = Math.ceil(sortedData.length / state.itemsPerPage);
  const totalItems = sortedData.length;

  useEffect(() => {
    if (state.currentPage > totalPages && totalPages > 0) {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [totalPages, state.currentPage]);

  const handleSort = (key: string) => {
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;

    setState((prev) => {
      const sameKey = prev.sortConfig?.key === key;
      const cur = sameKey ? prev.sortConfig?.direction : undefined;

      const next = cur === "asc" ? "desc" : cur === "desc" ? null : "asc";

      return {
        ...prev,
        sortConfig: next ? { key, direction: next } : null,
      };
    });
  };

  const contextValue: TableContextValue<T> = {
    columns,
    data,
    actions,
    loading,
    emptyMessage,
    selectable,
    onRowClick,
    selectedRow,
    onSelectionChange,
    state,
    setState,
    sortedData: sortedData,
    handleSort,
    selectedRows: state.selectedRows,
    sortConfig: state.sortConfig,
    totalItems,
    totalPages,
    draggable,
    onOrderChange,
    dragHandleColumn,
    isDragging,
    pagination,
    draggedItemPosition,
  };

  const content = (
    <TableContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>{children}</div>
    </TableContext.Provider>
  );

  if (draggable) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(() => {
            const hasSearch = state.searchTerm.trim() !== "";
            const hasSort = state.sortConfig !== null;

            if (hasSearch && !hasSort) {
              return data.map((item: T) => (item as any).id);
            } else if (hasSearch && hasSort) {
              return [...data]
                .sort((a, b) => {
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

                  if (
                    typeof aValue === "string" &&
                    typeof bValue === "string"
                  ) {
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
                })
                .map((item: T) => (item as any).id);
            } else if (hasSort) {
              return sortedData.map((item: T) => (item as any).id);
            }

            return orderedData.map((item: T) => (item as any).id);
          })()}
          strategy={verticalListSortingStrategy}
        >
          {content}
        </SortableContext>
      </DndContext>
    );
  }

  return content;
}
