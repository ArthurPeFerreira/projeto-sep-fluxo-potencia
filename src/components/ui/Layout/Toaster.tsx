"use client";

import { Toaster as ToasterComponent, ToasterProps } from "sonner";
import { useLayout } from "./LayoutProvider";
import { ThemeState } from "./types";

export function Toaster({ ...props }: ToasterProps) {
  const { themeEnabled, defaultMode } = useLayout();

  const theme = themeEnabled ? defaultMode : defaultMode;

  return (
    <ToasterComponent
      duration={3000}
      position="top-center"
      richColors
      theme={theme as ThemeState}
      expand
      closeButton
      visibleToasts={3}
      gap={5}
      {...props}
    />
  );
}
