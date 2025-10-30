"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface NavbarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarContent({ children, className }: NavbarContentProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between w-full h-full",
        className
      )}
    >
      {children}
    </nav>
  );
}
