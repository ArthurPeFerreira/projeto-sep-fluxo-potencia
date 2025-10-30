"use client";

import { cn } from "@/lib/utils/utils";

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden w-full h-full flex flex-col gap-2 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}
