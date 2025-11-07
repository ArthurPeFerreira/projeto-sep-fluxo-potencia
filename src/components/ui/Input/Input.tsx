import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { SeePasswordIcon } from "../Icons/SeePasswordIcon";
import { inputVariants, InputVariantProps } from "./inputVariants";
import { Button } from "../Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import Decimal from "decimal.js";

export function Input({
  className,
  type,
  title,
  variant = "outline",
  showButtons = true,
  disableButtons = false,
  ...props
}: React.ComponentProps<"input"> &
  InputVariantProps & {
    showButtons?: boolean;
    disableButtons?: boolean;
  }) {
  const [seePassword, setSeePassword] = React.useState(false);
  const [localValue, setLocalValue] = React.useState<string | null>(null);
  const isNumber = type === "number";

  const value = (props as any)?.value;
  const onChange = (props as any)?.onChange;

  const normalizedValue = React.useMemo(() => {
    if (!isNumber) return value;
    if (localValue !== null) return localValue;
    return value === undefined || value === null ? "" : value;
  }, [isNumber, value, localValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;

      if (isNumber) {
        const inputValue = e.currentTarget.value;
        setLocalValue(inputValue);
        return;
      }

      onChange(e);
    },
    [isNumber, onChange]
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isNumber) {
        const inputValue =
          localValue !== null ? localValue : e.currentTarget.value;
        setLocalValue(null);
        const min = (props as any)?.min;
        const max = (props as any)?.max;

        if (inputValue === "") {
          if (min !== undefined) {
            onChange(Number(min));
          } else {
            onChange(0);
          }
          return;
        }

        try {
          const numericValue = new Decimal(inputValue);
          let finalValue = numericValue;

          if (min !== undefined && numericValue.lt(min)) {
            finalValue = new Decimal(min);
          } else if (max !== undefined && numericValue.gt(max)) {
            finalValue = new Decimal(max);
          }

          onChange(Number(finalValue.toString()));
        } catch {
          if (min !== undefined) {
            onChange(Number(min));
          } else if (max !== undefined) {
            onChange(Number(max));
          } else {
            onChange(0);
          }
        }
      }

      if ((props as any)?.onBlur) {
        (props as any).onBlur(e);
      }
    },
    [isNumber, onChange, props, localValue]
  );

  const handleIncrement = React.useCallback(() => {
    if (!isNumber || !onChange) return;

    const currentValue = new Decimal(value?.toString() || "0");
    const max = (props as any)?.max;
    const step = new Decimal((props as any)?.step || "1");

    const newValue = currentValue.plus(step);
    if (max === undefined || newValue.lte(max)) {
      onChange(Number(newValue.toString()));
    }
  }, [isNumber, onChange, value, props]);

  const handleDecrement = React.useCallback(() => {
    if (!isNumber || !onChange) return;

    const currentValue = new Decimal(value?.toString() || "0");
    const min = (props as any)?.min;
    const step = new Decimal((props as any)?.step || "1");

    const newValue = currentValue.minus(step);
    if (min === undefined || newValue.gte(min)) {
      onChange(Number(newValue.toString()));
    }
  }, [isNumber, onChange, value, props]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && isNumber) {
        e.preventDefault();
        e.stopPropagation();
        
        const inputValue =
          localValue !== null ? localValue : e.currentTarget.value;
        setLocalValue(null);
        const min = (props as any)?.min;
        const max = (props as any)?.max;

        if (inputValue === "") {
          const minValue = min !== undefined ? Number(min) : 0;
          onChange(minValue);
          return;
        }

        try {
          const numericValue = new Decimal(inputValue);
          let finalValue = numericValue;

          if (min !== undefined && numericValue.lt(min)) {
            finalValue = new Decimal(min);
          } else if (max !== undefined && numericValue.gt(max)) {
            finalValue = new Decimal(max);
          }

          onChange(Number(finalValue.toString()));
        } catch {
          if (min !== undefined) {
            onChange(Number(min));
          } else if (max !== undefined) {
            onChange(Number(max));
          } else {
            onChange(0);
          }
        }
        return;
      }

      if ((props as any)?.onKeyDown) {
        (props as any).onKeyDown(e);
      }
    },
    [isNumber, onChange, props, localValue]
  );

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isNumber && e.currentTarget.value) e.currentTarget.select();
      if ((props as any)?.onFocus) (props as any).onFocus(e);
    },
    [isNumber, props]
  );

  const currentValue = React.useMemo(() => {
    if (!isNumber) return new Decimal("0");

    const valueToUse = localValue !== null ? localValue : value;

    if (!valueToUse || valueToUse === "") return new Decimal("0");
    try {
      return new Decimal(valueToUse.toString());
    } catch {
      return new Decimal("0");
    }
  }, [isNumber, value, localValue]);

  const min = (props as any)?.min;
  const max = (props as any)?.max;
  const canDecrement = !isNumber || min === undefined || currentValue.gt(min);
  const canIncrement = !isNumber || max === undefined || currentValue.lt(max);

  return (
    <div className="flex flex-col gap-1 w-full">
      {title && <h2 className="text-md font-medium">{title}</h2>}
      <div className="relative">
        {isNumber && showButtons ? (
          <div
            className={cn(
              "flex items-center rounded-md w-full",
              variant === "default" && "border border-primary bg-primary",
              variant === "secondary" && "border border-secondary bg-secondary",
              variant === "outline" &&
                "border border-input bg-background dark:bg-input/30 dark:border-input"
            )}
          >
            <Button
              type="button"
              variant={variant}
              size="sm"
              onClick={handleDecrement}
              disabled={!canDecrement || disableButtons}
              className="h-8 w-8 p-0 rounded-l-md rounded-r-none border-r border-current/20"
            >
              <FaMinus className="w-3 h-3" />
            </Button>
            <input
              type="text"
              data-slot="input"
              className={cn(
                "h-8 flex-1 px-2 py-1 text-center border-0 bg-transparent outline-none text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                variant === "default" &&
                  "text-primary-foreground placeholder:text-primary-foreground/70",
                variant === "secondary" &&
                  "text-secondary-foreground placeholder:text-secondary-foreground/70",
                variant === "outline" &&
                  "text-foreground placeholder:text-muted-foreground",
                className
              )}
              {...props}
              value={normalizedValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              variant={variant}
              size="sm"
              onClick={handleIncrement}
              disabled={!canIncrement || disableButtons}
              className="h-8 w-8 p-0 rounded-r-md rounded-l-none border-l border-current/20"
            >
              <FaPlus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <>
            <input
              type={seePassword ? "text" : type}
              data-slot="input"
              className={cn(inputVariants({ variant }), className)}
              {...props}
              value={normalizedValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            {type === "password" && (
              <SeePasswordIcon
                seePassword={seePassword}
                setSeePassword={setSeePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
