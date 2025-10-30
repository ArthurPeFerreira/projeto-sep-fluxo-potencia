import { cn } from "@/lib/utils/utils";

export function BreadcrumbRoot({
  children,
  hasBorder = true,
  ...props
}: React.ComponentProps<"div"> & {
  hasBorder?: boolean;
}) {
  return (
    <div
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn("mb-2 py-2", hasBorder && "border-b")}
      {...props}
    >
      {children}
    </div>
  );
}
