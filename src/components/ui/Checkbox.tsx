import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/utils";
import { FaCheck, FaMinus } from "react-icons/fa";

export type CheckboxSize = "sm" | "md" | "lg";

const CHECKBOX_SIZES = {
  sm: {
    container: "w-4 h-4",
    icon: "w-2.5 h-2.5",
  },
  md: {
    container: "w-5 h-5",
    icon: "w-3 h-3",
  },
  lg: {
    container: "w-6 h-6",
    icon: "w-4 h-4",
  },
} as const;

export type CheckboxVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "information"
  | "light"
  | "dark";

const CHECKBOX_VARIANTS = {
  primary: {
    base: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 border-blue-600 dark:border-blue-500",
    checked:
      "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500",
    hover: "hover:border-blue-400 dark:hover:border-blue-500",
    focus:
      "focus:ring-2 focus:ring-white focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  secondary: {
    base: "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 border-gray-600 dark:border-gray-500",
    checked:
      "bg-gray-600 border-gray-600 dark:bg-gray-500 dark:border-gray-500",
    hover: "hover:border-gray-400 dark:hover:border-gray-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  success: {
    base: "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600 border-emerald-600 dark:border-emerald-500",
    checked:
      "bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    hover: "hover:border-emerald-400 dark:hover:border-emerald-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  danger: {
    base: "bg-red-600 hover:bg-red-700 disabled:bg-red-600 border-red-600 dark:border-red-500",
    checked: "bg-red-600 border-red-600 dark:bg-red-500 dark:border-red-500",
    hover: "hover:border-red-400 dark:hover:border-red-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  warning: {
    base: "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600 border-yellow-600 dark:border-yellow-500",
    checked:
      "bg-yellow-600 border-yellow-600 dark:bg-yellow-500 dark:border-yellow-500",
    hover: "hover:border-yellow-400 dark:hover:border-yellow-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  information: {
    base: "bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600 border-cyan-600 dark:border-cyan-500",
    checked:
      "bg-cyan-600 border-cyan-600 dark:bg-cyan-500 dark:border-cyan-500",
    hover: "hover:border-cyan-400 dark:hover:border-cyan-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  light: {
    base: "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 border-gray-200 dark:border-gray-500",
    checked:
      "bg-gray-200 border-gray-200 dark:bg-gray-500 dark:border-gray-500",
    hover: "hover:border-gray-400 dark:hover:border-gray-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
  dark: {
    base: "bg-gray-800 hover:bg-gray-900 disabled:bg-gray-800 border-gray-800 dark:border-gray-500",
    checked:
      "bg-gray-800 border-gray-800 dark:bg-gray-500 dark:border-gray-500",
    hover: "hover:border-gray-400 dark:hover:border-gray-500",
    focus:
      "focus:ring-2 focus:ring-white  focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  },
} as const;

const getVariantClasses = (variant: CheckboxVariant, checked: boolean) => {
  const variantConfig = CHECKBOX_VARIANTS[variant];
  return cn(
    variantConfig.base,
    checked && variantConfig.checked,
    variantConfig.hover,
    variantConfig.focus
  );
};

const getSizeClasses = (size: CheckboxSize) => {
  return CHECKBOX_SIZES[size];
};

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  error?: string;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = "md",
      variant = "primary",
      error,
      indeterminate = false,
      checked,
      onCheckedChange,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const isChecked = checked || false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    const sizeClasses = getSizeClasses(size);
    const variantClasses = getVariantClasses(
      variant as CheckboxVariant,
      isChecked
    );

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              "relative flex items-center justify-center",
              "border rounded transition-all duration-500",
              "cursor-pointer select-none",
              sizeClasses.container,
              variantClasses,
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {/* Checkmark icon */}
            {(isChecked || indeterminate) && (
              <div className="absolute text-white transition-all duration-500">
                {indeterminate ? (
                  <FaMinus className={sizeClasses.icon} />
                ) : (
                  <FaCheck className={sizeClasses.icon} />
                )}
              </div>
            )}
          </label>
        </div>

        {(label || description || error) && (
          <div className="flex flex-col space-y-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "font-medium cursor-pointer",
                  disabled && "cursor-not-allowed",
                  error
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export const CheckboxGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
  }
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-3", className)}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";

export const CheckboxRoot = Checkbox;
export const CheckboxGroupRoot = CheckboxGroup;
