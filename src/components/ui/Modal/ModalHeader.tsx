"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}
