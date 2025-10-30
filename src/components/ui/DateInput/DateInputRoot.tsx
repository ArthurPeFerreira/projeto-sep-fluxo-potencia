import * as React from "react";
import { cn } from "@/lib/utils/utils";
import {
  formatDateToBrazilian,
  formatDateToISO,
  formatDateInput,
  validateDateInput,
  createDateFromISO,
} from "./dateFormatters";
import { Calendar } from "@/components/ui/Calendar";
import { CiCalendar } from "react-icons/ci";

interface DateInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function DateInputRoot({
  title,
  value = "",
  onChange,
  className,
  ...props
}: DateInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [calendarPosition, setCalendarPosition] = React.useState<
    "bottom" | "top"
  >("bottom");
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  );
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
  const inputRef = React.useRef<HTMLInputElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const calendarContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (value && !isFocused) {
      setDisplayValue(formatDateToBrazilian(value));
      const date = createDateFromISO(value);
      setCalendarMonth(date);
    }
  }, [value, isFocused]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInsideInput = calendarRef.current?.contains(target);
      const isInsideCalendar = calendarContainerRef.current?.contains(target);

      if (!isInsideInput && !isInsideCalendar) {
        setShowCalendar(false);
      }
    };

    const handleResize = () => {
      if (showCalendar) {
        const position = calculateCalendarPosition();
        setCalendarPosition(position);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize);
      };
    }
  }, [showCalendar]);

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const formattedValue = formatDateInput(inputValue);
    setDisplayValue(formattedValue);

    const validation = validateDateInput(formattedValue);
    setValidationError(validation.isValid ? null : validation.error || null);

    const numbers = formattedValue.replace(/\D/g, "");
    if (numbers.length >= 4) {
      const month = parseInt(numbers.slice(2, 4));
      const year =
        numbers.length >= 8
          ? parseInt(numbers.slice(4, 8))
          : new Date().getFullYear();

      if (month >= 1 && month <= 12) {
        const newDate = new Date(year, month - 1, 1);
        setCalendarMonth(newDate);
      }
    }

    const isoValue = formatDateToISO(formattedValue);
    if (onChange && isoValue && formattedValue.length === 10) {
      onChange(isoValue);
    } else if (onChange && formattedValue.length === 0) {
      onChange("");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!value) {
      setDisplayValue("");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value) {
      setDisplayValue(formatDateToBrazilian(value));
    }
  };

  const calculateCalendarPosition = () => {
    if (!inputRef.current) return "bottom";

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const calendarHeight = 320;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
      return "top";
    }

    return "bottom";
  };

  const handleContainerClick = () => {
    const position = calculateCalendarPosition();
    setCalendarPosition(position);
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      const isoDate = date.toISOString().split("T")[0];
      onChange(isoDate);
      setDisplayValue(formatDateToBrazilian(isoDate));
      setShowCalendar(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {title && <h2 className="text-md font-medium">{title}</h2>}
      <div className="relative" ref={calendarRef}>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleDisplayChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="dd/mm/aaaa"
          maxLength={12}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            validationError
              ? "border-destructive ring-destructive/20 ring-[3px]"
              : "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "cursor-text",
            className
          )}
          {...props}
        />

        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={handleContainerClick}
        >
          <CiCalendar className="text-muted-foreground" size={16} />
        </div>

        {showCalendar && (
          <div
            ref={calendarContainerRef}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 z-50 bg-background border border-border rounded-lg shadow-l p-1",
              calendarPosition === "bottom"
                ? "top-full mt-1"
                : "bottom-full mb-1"
            )}
          >
            <Calendar
              mode="single"
              selected={value ? createDateFromISO(value) : undefined}
              onSelect={handleDateSelect}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              autoFocus
            />
          </div>
        )}
      </div>
      {validationError && (
        <p className="text-sm text-destructive mt-1">{validationError}</p>
      )}
    </div>
  );
}
