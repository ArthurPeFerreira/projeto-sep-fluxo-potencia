"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { useLayout } from "../LayoutProvider";

interface NavbarRootProps {
  children: React.ReactNode;
  className?: string;
}

export function NavbarRoot({ children, className }: NavbarRootProps) {
  const layout = useLayout();

  if (!layout.hasNavbar) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 z-30",
        layout.sidebarPosition === "left" ? "right-0" : "left-0",
        layout.hasSidebar && layout.sidebarMode !== "overlay"
          ? layout.sidebarCollapsed
            ? layout.sidebarPosition === "left"
              ? "left-14"
              : "right-14"
            : layout.sidebarPosition === "left"
            ? `left-[${layout.sidebarWidth}px]`
            : `right-[${layout.sidebarWidth}px]`
          : layout.sidebarPosition === "left"
          ? "left-0"
          : "right-0",
        "flex items-center justify-between px-2 transition-[left,right]",
        "border-b",
        className
      )}
      style={{
        height: `${layout.navbarWidth}px`,
        ...(layout.hasSidebar && layout.sidebarMode !== "overlay"
          ? layout.sidebarPosition === "left"
            ? {
                left: layout.sidebarCollapsed
                  ? "3.5rem"
                  : `${layout.sidebarWidth}px`,
                right: "0",
              }
            : {
                right: layout.sidebarCollapsed
                  ? "3.5rem"
                  : `${layout.sidebarWidth}px`,
                left: "0",
              }
          : layout.sidebarPosition === "left"
          ? { left: "0", right: "0" }
          : { right: "0", left: "0" }),
        transitionDuration: "300ms",
        transitionTimingFunction: "ease-in-out",
      }}
    >
      {children}
    </nav>
  );
}
