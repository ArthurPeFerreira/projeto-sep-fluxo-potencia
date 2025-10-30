import { cn } from "../../../lib/utils/utils";

export function CardFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-center w-full gap-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
