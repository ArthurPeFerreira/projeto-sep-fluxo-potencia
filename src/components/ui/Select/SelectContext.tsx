"use client";

import * as React from "react";
import { SelectVariantProps } from "./selectVariants";

export interface SelectOption {
  key: string;
  value: string;
  group?: string;
  render: React.ReactNode;
  searchValue?: string;
}

export interface SelectContextType extends SelectVariantProps {
  title?: string;
  searchable?: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  emptyMessage: string;
  noResultsMessage: string;
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder: string;
  position: "bottom" | "top";
  setPosition: (position: "bottom" | "top") => void;
  loading?: boolean;
  disabled?: boolean;
}

export const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
);

export function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("useSelectContext deve ser usado dentro de SelectRoot");
  }
  return context;
}
