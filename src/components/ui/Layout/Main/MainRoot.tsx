"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils/utils";
import { Layout } from "..";
import { getResponsiveSidebarWidth } from "../utils";

interface MainRootProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MainRoot({ children, className, style }: MainRootProps) {
  const layout = Layout.useLayout();

  return (
    <main
      className={cn(
        "flex-1 transition-[margin-left,margin-right] p-4 relative min-h-screen",
        layout.scrollbarTarget === "main" ? "overflow-auto" : "overflow-hidden",
        layout.sidebarPosition === "right" && layout.scrollbarTarget === "main"
          ? "scrollbar-right"
          : "",
        layout.hasSidebar && layout.sidebarMode !== "overlay"
          ? layout.sidebarCollapsed
            ? layout.sidebarPosition === "left"
              ? "ml-14"
              : "mr-14"
            : ""
          : layout.sidebarPosition === "left"
          ? "ml-0"
          : "mr-0",
        className
      )}
      style={{
        marginTop: layout.hasNavbar ? `${layout.navbarWidth}px` : "0",
        minHeight: layout.hasNavbar
          ? `calc(100vh - ${layout.navbarWidth}px)`
          : "100vh",
        ...(layout.hasSidebar && layout.sidebarMode !== "overlay"
          ? layout.sidebarPosition === "left"
            ? {
                marginLeft: `${getResponsiveSidebarWidth(
                  layout.sidebarCollapsed,
                  layout.sidebarWidth,
                  layout.collapsedSidebarWidth
                )}px`,
              }
            : {
                marginRight: `${getResponsiveSidebarWidth(
                  layout.sidebarCollapsed,
                  layout.sidebarWidth,
                  layout.collapsedSidebarWidth
                )}px`,
              }
          : {
              marginLeft: "0",
              marginRight: "0",
            }),
        transitionDuration: "300ms",
        transitionTimingFunction: "ease-in-out",
        ...style,
      }}
    >
      {children}
      {layout.sidebarMode === "overlay" &&
        layout.hasSidebar &&
        !layout.sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-30 transition-opacity"
            style={{
              transitionDuration: "300ms",
              transitionTimingFunction: "ease-in-out",
            }}
          />
        )}
    </main>
  );
}
