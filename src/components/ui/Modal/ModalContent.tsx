"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn("relative w-full", className)}>{children}</div>;
}
