"use client";

import { cn } from "@/lib/utils/utils";

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-14 w-full p-2 transition-[width,height,padding] duration-500 ease-in-out",
        "border-b",
        className
      )}
    >
      {children}
    </div>
  );
}
