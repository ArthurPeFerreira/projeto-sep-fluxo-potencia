"use client";

import { cn } from "@/lib/utils/utils";

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("flex flex-col gap-2 h-fit p-2", className)}>
      {children}
    </div>
  );
}
