"use client";

import * as React from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useSelectContext } from "./SelectContext";
import { Input } from "../Input";
import { SelectOptions } from "./SelectOptions";
import { cn } from "@/lib/utils/utils";
import { selectVariants } from "./selectVariants";

interface SelectFieldProps {
  placeholder?: string;
  size?: "sm" | "default";
  className?: string;
}

export function SelectField({}: SelectFieldProps) {
  const {
    searchable,
    searchValue,
    setSearchValue,
    selectedValue,
    isOpen,
    setIsOpen,
    emptyMessage,
    noResultsMessage,
    options,
    placeholder: contextPlaceholder,
    position,
    setPosition,
    loading,
    disabled,
    variant,
  } = useSelectContext();

  const selectRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as Element).closest("[data-select-container]")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  React.useEffect(() => {
    if (selectedValue) {
      setSearchValue("");
    }
  }, [selectedValue, setSearchValue]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
    }
  }, [isOpen, setSearchValue]);

  const calculatePosition = React.useCallback(() => {
    if (!selectRef.current) return "bottom";

    const selectRect = selectRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const optionsHeight = 240;
    const spaceBelow = viewportHeight - selectRect.bottom;
    const spaceAbove = selectRect.top;

    if (spaceBelow < optionsHeight && spaceAbove > optionsHeight) {
      return "top";
    }

    return "bottom";
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        const newPosition = calculatePosition();
        setPosition(newPosition);
      }
    };

    if (isOpen) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize);
      };
    }
  }, [isOpen, calculatePosition, setPosition]);

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

  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const isActivelyTyping = searchValue !== "";
  const shouldShowRender = selectedOption && !isActivelyTyping;

  return (
    <div className="relative" data-select-container ref={selectRef}>
      <div className="relative">
        {searchable && (
          <div
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-20",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => {
              if (disabled) return;
              setSearchValue("");
              setIsOpen(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            <SearchIcon 
              className={cn(
                "size-4",
                variant === "outline" && "text-muted-foreground",
                variant === "default" && "text-primary-foreground/70",
                variant === "secondary" && "text-secondary-foreground/70"
              )}
            />
          </div>
        )}

        <div className="relative">
          {shouldShowRender && (
            <div
              className={cn(
                selectVariants({ variant }),
                "absolute inset-0 flex items-center px-3 py-2 text-sm",
                "pointer-events-none z-0",
                searchable ? "pl-8" : "pl-3"
              )}
            >
              <div className="flex items-center w-full">
                {selectedOption.render}
              </div>
            </div>
          )}

          <Input
            ref={inputRef}
            type="text"
            placeholder={selectedOption ? "" : contextPlaceholder}
            value={isActivelyTyping ? searchValue : ""}
            onChange={(e) => {
              if (searchable && !disabled) {
                setSearchValue(e.target.value);
              }
            }}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true);
              }
            }}
            onClick={() => {
              if (disabled) return;
              if (searchable) {
                setIsOpen(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }
            }}
            className={cn(
              selectVariants({ variant }),
              searchable ? "pl-8" : "pl-3",
              "relative z-10",
              shouldShowRender
                ? "text-transparent placeholder:text-transparent bg-transparent border-transparent"
                : "",
              shouldShowRender && !searchable
                ? "cursor-pointer"
                : "",
              disabled ? "cursor-not-allowed opacity-50" : ""
            )}
            readOnly={!searchable}
            disabled={disabled}
          />
        </div>

        <div
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={() => {
            if (disabled) return;
            setIsOpen(!isOpen);
          }}
        >
          <ChevronDownIcon 
            className={cn(
              "size-4",
              variant === "outline" && "text-muted-foreground",
              variant === "default" && "text-primary-foreground/70",
              variant === "secondary" && "text-secondary-foreground/70"
            )}
          />
        </div>
      </div>
      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-md border shadow-md [&::-webkit-scrollbar]:hidden",
            position === "bottom" ? "top-full mt-1" : "bottom-full mb-1",
            variant === "outline" && "bg-popover border-border",
            variant === "default" && "bg-primary border-primary text-primary-foreground",
            variant === "secondary" && "bg-secondary border-secondary text-secondary-foreground"
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsOpen(false);
            }
          }}
        >
          <SelectOptions />
          {filteredOptions.length === 0 && !loading && (
            <div className={cn(
              "px-2 py-3 text-sm text-center",
              variant === "outline" && "text-muted-foreground",
              variant === "default" && "text-primary-foreground/70",
              variant === "secondary" && "text-secondary-foreground/70"
            )}>
              {searchValue ? noResultsMessage : emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
