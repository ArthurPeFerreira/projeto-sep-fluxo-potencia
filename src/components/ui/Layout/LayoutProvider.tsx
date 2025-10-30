"use client";

import { createContext, useContext, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useLayoutConfig } from "./useLayoutConfig";
import { Toaster } from "./Toaster";
import { cn } from "@/lib/utils/utils";
import type { UseLayoutConfigReturn, LayoutProviderProps } from "./types";

export type LayoutContextType = UseLayoutConfigReturn;

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export function LayoutProvider({ children, config = {} }: LayoutProviderProps) {
  const layoutConfig = useLayoutConfig(config);

  useEffect(() => {
    if (layoutConfig.scrollbarTarget === "body") {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      document.documentElement.style.height = "auto";
    } else {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.height = "100vh";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, [layoutConfig.scrollbarTarget]);

  return (
    <LayoutContext.Provider value={layoutConfig}>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background text-foreground",
            layoutConfig.scrollbarTarget === "body"
              ? "h-auto"
              : "h-full flex flex-col"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme={layoutConfig.defaultMode}
            enableSystem={layoutConfig.themeEnabled}
            forcedTheme={
              layoutConfig.themeEnabled ? undefined : layoutConfig.defaultMode
            }
          >
            <div
              className={cn(
                layoutConfig.scrollbarTarget === "body"
                  ? "min-h-screen"
                  : "flex h-screen"
              )}
            >
              <div className="flex-1 flex flex-col relative">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </LayoutContext.Provider>
  );
}
