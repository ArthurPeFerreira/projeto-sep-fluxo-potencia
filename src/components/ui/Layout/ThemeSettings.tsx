"use client";

import { Monitor, Moon, Sun, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { useLayout } from "./LayoutProvider";

interface ThemeSettingsProps {
  className?: string;
}

export function ThemeSettings({ className }: ThemeSettingsProps) {
  const { themeEnabled, defaultMode, toggleTheme, setDefaultMode } =
    useLayout();

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {themeEnabled ? (
            <ToggleRight className="h-5 w-5 text-primary" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">Modo Noturno/Diurno</span>
        </div>
        <Switch checked={themeEnabled} onCheckedChange={toggleTheme} />
      </div>

      {themeEnabled && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Modo Padrão do Site</label>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {defaultMode === "light" && <Sun className="h-4 w-4 mr-2" />}
                {defaultMode === "dark" && <Moon className="h-4 w-4 mr-2" />}
                {defaultMode === "system" && (
                  <Monitor className="h-4 w-4 mr-2" />
                )}
                {defaultMode === "light" && "Modo Diurno"}
                {defaultMode === "dark" && "Modo Noturno"}
                {defaultMode === "system" && "Seguir Sistema"}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start" className="w-full">
              <DropdownMenu.Item onClick={() => setDefaultMode("light")}>
                <Sun className="h-4 w-4 mr-2" />
                Modo Diurno
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDefaultMode("dark")}>
                <Moon className="h-4 w-4 mr-2" />
                Modo Noturno
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setDefaultMode("system")}>
                <Monitor className="h-4 w-4 mr-2" />
                Seguir Sistema
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      )}
    </div>
  );
}
