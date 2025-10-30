import { cn } from "../../../lib/utils/utils";

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header flex items-center justify-center w-full gap-1.5",
        className
      )}
      {...props}
    />
  );
}
