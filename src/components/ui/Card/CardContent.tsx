export function CardContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content flex items-center justify-center w-full text-center gap-1.5"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
