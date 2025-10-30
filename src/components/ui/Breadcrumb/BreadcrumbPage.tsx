import { cn } from "@/lib/utils/utils";

export function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal", className)}
      {...props}
    />
  );
}
