"use client";

import * as React from "react";
import { useSelectContext } from "./SelectContext";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { cn } from "@/lib/utils/utils";

export function SelectOptions() {
  const {
    options,
    searchValue,
    searchable,
    setSelectedValue,
    setIsOpen,
    onValueChange,
    loading,
    variant,
  } = useSelectContext();

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchValue) return options;

    return options.filter((option) => {
      const text = option.searchValue
        ? option.searchValue
        : typeof option.render === "string"
        ? option.render
        : option.value;
      return text.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [options, searchValue, searchable]);

  const groupedOptions = React.useMemo(() => {
    const groups: { [key: string]: typeof options } = {};
    const ungrouped: typeof options = [];

    filteredOptions.forEach((option) => {
      if (option.group) {
        if (!groups[option.group]) {
          groups[option.group] = [];
        }
        groups[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });

    return { groups, ungrouped };
  }, [filteredOptions]);

  if (loading) {
    return (
      <div className="px-2 py-3 text-sm text-center">
        <LoadingIcon size={20} />
      </div>
    );
  }

  if (filteredOptions.length === 0) {
    return null;
  }

  return (
    <>
      {groupedOptions.ungrouped.map((option) => (
        <div
          key={option.key}
          className={cn(
            "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none",
            variant === "outline" && "hover:bg-accent hover:text-accent-foreground",
            variant === "default" && "hover:bg-white/80 dark:hover:bg-black/80 hover:text-primary-foreground",
            variant === "secondary" && "hover:bg-black/20 dark:hover:bg-white/20 hover:text-secondary-foreground"
          )}
          onClick={() => {
            setSelectedValue(option.value);
            setIsOpen(false);
            onValueChange?.(option.key);
          }}
        >
          <span className="flex-1">{option.render}</span>
        </div>
      ))}

      {Object.entries(groupedOptions.groups).map(
        ([groupName, groupOptions]) => (
          <div key={groupName}>
            <div className="text-muted-foreground px-2 py-1.5 text-xs">
              {groupName}
            </div>
            {groupOptions.map((option) => (
              <div
                key={option.key}
                className={cn(
                  "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none",
                  variant === "outline" && "hover:bg-accent hover:text-accent-foreground",
                  variant === "default" && "hover:bg-white/80 dark:hover:bg-black/80 hover:text-primary-foreground",
                  variant === "secondary" && "hover:bg-black/20 dark:hover:bg-white/20 hover:text-secondary-foreground"
                )}
                onClick={() => {
                  setSelectedValue(option.value);
                  setIsOpen(false);
                  onValueChange?.(option.key);
                }}
              >
                <span className="flex-1">{option.render}</span>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}
