import { cva, type VariantProps } from "class-variance-authority";

export const selectVariants = cva(
  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline:
          "border-input bg-background dark:bg-input/30 dark:border-input placeholder:text-muted-foreground caret-foreground",
        default:
          "border-primary bg-primary text-primary-foreground shadow-sm placeholder:text-primary-foreground/70 caret-primary-foreground",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground shadow-sm placeholder:text-secondary-foreground/70 caret-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
);

export type SelectVariantProps = VariantProps<typeof selectVariants>;
