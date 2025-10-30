"use client";

import { cn } from "@/lib/utils/utils";
import { Layout } from "..";
import { useCallback, useEffect, useRef } from "react";

interface SidebarRootProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarRoot({ children, className }: SidebarRootProps) {
  const layout = Layout.useLayout();
  const sidebarRef = useRef<HTMLElement>(null);

  const openSidebar = useCallback(() => {
    if (!layout.sidebarAlwaysOpen) {
      layout.toggleSidebarCollapsed(false);
    }
  }, [layout]);

  const closeSidebar = useCallback(() => {
    if (!layout.sidebarAlwaysOpen) {
      layout.toggleSidebar();
    }
  }, [layout]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        layout.sidebarCloseOnClickOutside &&
        layout.hasSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        layout.sidebarCurrentState === "open" &&
        !layout.sidebarAlwaysOpen
      ) {
        closeSidebar();
      }
    },
    [layout, closeSidebar]
  );

  useEffect(() => {
    if (!layout.hasSidebar) return;

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, layout.hasSidebar]);

  if (!layout.hasSidebar) return null;

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed flex flex-col transition-[transform,opacity] ease-in-out z-40 overflow-hidden",
        layout.sidebarPosition === "left" ? "left-0" : "right-0",
        "top-0 h-full border-r",
        "bg-background",
        className
      )}
      style={{
        width: `${layout.sidebarWidth}px`,
        opacity: layout.hasSidebar && !layout.sidebarCollapsed ? 1 : 0,
        transform: layout.hasSidebar
          ? layout.sidebarCollapsed
            ? layout.sidebarPosition === "left"
              ? "translateX(-100%)"
              : "translateX(100%)"
            : "translateX(0)"
          : layout.sidebarPosition === "left"
          ? "translateX(-100%)"
          : "translateX(100%)",
        transitionDuration: "300ms",
        transitionTimingFunction: "ease-in-out",
        pointerEvents:
          layout.hasSidebar && !layout.sidebarCollapsed ? "auto" : "none",
      }}
      onClick={layout.sidebarAlwaysOpen ? undefined : openSidebar}
    >
      {children}
    </aside>
  );
}
