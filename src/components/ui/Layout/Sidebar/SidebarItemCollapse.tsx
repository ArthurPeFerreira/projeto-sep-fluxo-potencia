"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/utils";
import { ChevronRight } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { Layout } from "..";

interface SidebarItemCollapseProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  defaultExpanded?: boolean;
}

export function SidebarItemCollapse({
  title,
  icon,
  children,
  className,
  collapsed,
  defaultExpanded = false,
}: SidebarItemCollapseProps) {
  const layout = Layout.useLayout();
  const isCollapsed = collapsed ?? layout.sidebarCollapsed;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (!layout.hasSidebar) return;
    
    if (isCollapsed) {
      layout.toggleSidebarCollapsed();
      setTimeout(() => {
        setIsExpanded(true);
      }, 100);
      return;
    }

    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isCollapsed) {
      setIsExpanded(false);
    } else if (defaultExpanded) {
      setIsExpanded(true);
    }
  }, [isCollapsed, defaultExpanded]);

  return (
    <div className={cn("flex flex-col justify-center", className)}>
      <SidebarItem
        icon={icon}
        onClick={toggleExpanded}
        collapsed={isCollapsed}
        className={cn(
          isCollapsed && "hover:bg-blue-600",
          "transition-all duration-500 ease-in-out"
        )}
      >
        {!isCollapsed && (
          <div className="flex flex-row w-full items-center">
            <span className="flex-1 text-left truncate">{title}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-all duration-500 ease-in-out flex-shrink-0",
                isExpanded && "rotate-90"
              )}
            />
          </div>
        )}
      </SidebarItem>

      {!isCollapsed && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            isExpanded
              ? "max-h-96 opacity-100 transform translate-y-0 mt-2"
              : "max-h-0 opacity-0 transform -translate-y-1 mt-0"
          )}
        >
          <div
            className={cn(
              "pl-4 flex flex-col gap-2 w-full transition-all duration-500 ease-in-out",
              isExpanded ? "transform scale-100" : "transform scale-95"
            )}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
