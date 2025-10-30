import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "file:text-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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

export type InputVariantProps = VariantProps<typeof inputVariants>;
