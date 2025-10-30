"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTableContext } from "./TableRoot";
import { Button } from "../Button";
import { Select } from "../Select";

interface TablePaginationProps {
  itemsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  hideItemsPerPageChange?: boolean;
}

export function TablePagination<T = any>({
  itemsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  hideItemsPerPageChange = false,
}: TablePaginationProps) {
  const { state, setState, sortedData, isDragging, pagination } =
    useTableContext<T>();

  if (!pagination) {
    return null;
  }

  if (isDragging) {
    return (
      <div className="flex items-center justify-center py-4 text-sm border-t">
        <span>
          Arraste os itens para reordenar. Todos os itens estão visíveis.
        </span>
      </div>
    );
  }

  const { currentPage, itemsPerPage } = state;
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }));
    onPageChange?.(page);

    const tableElement = document.querySelector("[data-table-container]");
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setState((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    onItemsPerPageChange?.(newItemsPerPage);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between py-3 px-2">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          {totalItems > 0
            ? `Mostrando ${startItem} a ${endItem} de ${totalItems} resultado${
                totalItems > 1 ? "s" : ""
              }`
            : "Nenhum resultado encontrado"}
        </div>

        {!hideItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Itens por página:</span>
            <div className="w-28">
              <Select.Root
                value={String(itemsPerPage)}
                onValueChange={(val) => handleItemsPerPageChange(Number(val))}
                options={itemsPerPageOptions.map((opt) => ({
                  key: String(opt),
                  value: String(opt),
                  render: String(opt),
                }))}
                placeholder=""
                searchable={false}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          variant="outline"
          size="icon"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1">
          {totalPages > 1 ? (
            getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2">...</span>
                ) : (
                  <Button
                    onClick={() => handlePageChange(page as number)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={cn(currentPage === page && "cursor-default")}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))
          ) : (
            <Button
              variant="default"
              size="icon"
              disabled
              className="cursor-default"
            >
              1
            </Button>
          )}
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          variant="outline"
          size="icon"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
