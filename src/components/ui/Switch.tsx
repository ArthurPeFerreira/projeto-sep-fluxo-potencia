"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils/utils";
import { useId } from "react";

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label?: string;
}

export function Switch({ className, label, id, ...props }: SwitchProps) {
  const generatedId = useId();
  const switchId = label || id ? id || generatedId : undefined;

  return (
    <div className="flex flex-row gap-2 items-center">
      <SwitchPrimitive.Root
        id={switchId}
        data-slot="switch"
        className={cn(
          "peer cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitive.Root>
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
}
