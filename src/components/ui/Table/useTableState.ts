"use client";

import { useState, useMemo, useEffect } from "react";
import { TableState, SortConfig } from "./types";

export function useTableState<T = any>(
  initialData: T[] = [],
  columns: any[] = []
) {
  const [state, setState] = useState<TableState<T>>({
    currentPage: 1,
    itemsPerPage: 10,
    sortConfig: null,
    selectedRows: [],
    searchTerm: "",
  });

  const filteredData = useMemo(() => {
    if (!state.searchTerm) return initialData;

    return initialData.filter((item) => {
      const searchLower = state.searchTerm.toLowerCase();

      if (columns && columns.length > 0) {
        return columns
          .filter((col) => col.searchable)
          .some((column) => {
            if (column.searchValue) {
              return column
                .searchValue(item)
                .toLowerCase()
                .includes(searchLower);
            }
            const value = (item as any)[column.key];
            return String(value).toLowerCase().includes(searchLower);
          });
      }

      return Object.values(item as any).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [initialData, state.searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!state.sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[state.sortConfig!.key];
      const bValue = (b as any)[state.sortConfig!.key];

      if (aValue < bValue) {
        return state.sortConfig!.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return state.sortConfig!.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, state.sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, state.currentPage, state.itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / state.itemsPerPage);
  const totalItems = sortedData.length;

  useEffect(() => {
    if (state.currentPage > totalPages && totalPages > 0) {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [totalPages, state.currentPage]);

  const setCurrentPage = (page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    setState((prev) => ({
      ...prev,
      itemsPerPage,
      currentPage: 1,
    }));
  };

  const setSortConfig = (sortConfig: SortConfig | null) => {
    setState((prev) => ({ ...prev, sortConfig }));
  };

  const setSelectedRows = (selectedRows: T[]) => {
    setState((prev) => ({ ...prev, selectedRows }));
  };

  const setSearchTerm = (searchTerm: string) => {
    setState((prev) => ({
      ...prev,
      searchTerm,
      currentPage: 1,
    }));
  };

  const clearSelection = () => {
    setState((prev) => ({ ...prev, selectedRows: [] }));
  };

  const selectAll = () => {
    setState((prev) => ({ ...prev, selectedRows: [...sortedData] }));
  };

  const toggleRowSelection = (row: T) => {
    setState((prev) => {
      const isSelected = prev.selectedRows.includes(row);
      const newSelectedRows = isSelected
        ? prev.selectedRows.filter((r) => r !== row)
        : [...prev.selectedRows, row];
      return { ...prev, selectedRows: newSelectedRows };
    });
  };

  return {
    state,
    filteredData,
    sortedData,
    paginatedData,
    totalPages,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
    setSortConfig,
    setSelectedRows,
    setSearchTerm,
    clearSelection,
    selectAll,
    toggleRowSelection,
  };
}
