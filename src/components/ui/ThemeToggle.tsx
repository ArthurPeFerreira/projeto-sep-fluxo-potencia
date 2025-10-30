"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Layout } from "@/components/ui/Layout";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const layout = Layout.useLayout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!layout.themeEnabled) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="icon">
          {mounted ? (
            (theme === "dark" && <Moon size={24} />) ||
            (theme === "light" && <Sun size={24} />) ||
            (theme === "system" && <Monitor size={24} />)
          ) : (
            <Monitor size={24} />
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onClick={() => setTheme("light")}>
          <Sun size={24} /> Light
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme("dark")}>
          <Moon size={24} /> Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme("system")}>
          <Monitor size={24} /> System
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
