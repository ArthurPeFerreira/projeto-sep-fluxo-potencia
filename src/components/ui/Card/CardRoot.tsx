import { cn } from "../../../lib/utils/utils";

export function CardRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
