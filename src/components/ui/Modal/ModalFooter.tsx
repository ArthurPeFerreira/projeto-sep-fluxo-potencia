"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
