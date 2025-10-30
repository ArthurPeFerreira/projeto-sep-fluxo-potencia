import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";

export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<typeof Link> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : Link;

  return <Comp data-slot="breadcrumb-link" className={className} {...props} />;
}
