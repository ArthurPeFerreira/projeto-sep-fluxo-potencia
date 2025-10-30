import { cn } from "@/lib/utils/utils";

export function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  );
}
