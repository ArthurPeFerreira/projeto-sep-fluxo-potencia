import { cn } from "@/lib/utils/utils";
import { Layout } from "..";
import Link from "next/link";

interface SidebarItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  collapsed?: boolean;
}

export function SidebarItem({
  children,
  icon,
  href,
  onClick,
  className,
  collapsed,
}: SidebarItemProps) {
  const layout = Layout.useLayout();
  const isCollapsed = collapsed ?? layout.sidebarCollapsed;
  const Component = href ? Link : "button";

  return (
    <Component
      href={href ?? "#"}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "flex items-center gap-2 w-full h-fit rounded-lg text-md font-medium p-2 cursor-pointer",
        "bg-blue-600 hover:bg-blue-700 text-[#E8E8E8] transition-colors",
        className
      )}
    >
      {icon && <div className="flex-shrink-0 text-2xl">{icon}</div>}
      <div
        className={cn(
          "overflow-hidden transition-all ease-in-out flex-1 text-left text-nowrap",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {children}
      </div>
    </Component>
  );
}
