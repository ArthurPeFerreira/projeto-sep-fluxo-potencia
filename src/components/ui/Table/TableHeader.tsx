"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils/utils";
import { TableHeaderProps } from "./types";
import { Title } from "../Title";
import { Input } from "../Input";
import { Search, X } from "lucide-react";
import { useTableContext } from "./TableRoot";

export function TableHeader({
  title,
  subtitle,
  actions,
  className,
  showSearch = false,
  searchPlaceholder,
}: TableHeaderProps) {
  const { state, setState } = useTableContext();

  const handleSearchChange = useCallback(
    (value: string | number) => {
      setState((prev) => ({
        ...prev,
        searchTerm: String(value),
        currentPage: 1,
      }));
    },
    [setState]
  );

  const clearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchTerm: "",
      currentPage: 1,
    }));
  }, [setState]);

  return (
    <div className={cn("w-full mb-4", className)}>
      <div className="flex items-center justify-between">
        <Title title={title} subtitle={subtitle} />
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {showSearch && (
        <div className="relative mt-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          <Input
            type="text"
            value={state.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder || "Pesquisar..."}
            className="pl-10 pr-8"
          />
          {state.searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:bg-gray-100 rounded-r-md px-2"
              title="Limpar pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
