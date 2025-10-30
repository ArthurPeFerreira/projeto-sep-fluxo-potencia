"use client";

import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { SelectContext, SelectOption } from "./SelectContext";
import { SelectField } from "./SelectField";
import { SelectVariantProps } from "./selectVariants";

interface SelectRootProps extends SelectVariantProps {
  title?: string;
  searchable?: boolean;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  emptyMessage?: string;
  noResultsMessage?: string;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
}

export function SelectRoot({
  title,
  searchable = true,
  className,
  value,
  onValueChange,
  defaultValue,
  emptyMessage = "Nenhuma opção disponível",
  noResultsMessage = "Nenhum resultado encontrado",
  options,
  placeholder = "Selecione...",
  loading = false,
  disabled = false,
  variant = "outline",
}: SelectRootProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState<string>(
    value || defaultValue || ""
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<"bottom" | "top">("bottom");

  React.useEffect(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.key === value);
      if (option) {
        setSelectedValue(option.value);
      } else {
        setSelectedValue("");
      }
    }
  }, [value, options]);

  React.useEffect(() => {
    if (isOpen) {
      const closeEvent = new CustomEvent("closeOtherSelects");
      window.dispatchEvent(closeEvent);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleCloseOtherSelects = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("closeOtherSelects", handleCloseOtherSelects);
    return () => {
      window.removeEventListener("closeOtherSelects", handleCloseOtherSelects);
    };
  }, [isOpen]);

  const contextValue = {
    title,
    searchable,
    searchValue,
    setSearchValue,
    selectedValue,
    setSelectedValue,
    isOpen,
    setIsOpen,
    emptyMessage,
    noResultsMessage,
    options,
    onValueChange,
    placeholder,
    position,
    setPosition,
    loading,
    disabled,
    variant,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-1 w-full", className)}>
        {title && <h2 className="text-md font-medium">{title}</h2>}
        <SelectField />
      </div>
    </SelectContext.Provider>
  );
}
