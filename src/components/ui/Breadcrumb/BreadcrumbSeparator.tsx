import { cn } from "@/lib/utils/utils";
import { ChevronRight } from "lucide-react";

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "list-none inline-flex items-center [&>svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}
