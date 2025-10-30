"use client";

import React, { useEffect } from "react";
import { FormProvider, FieldValues, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils/utils";
import { toast } from "sonner";

interface FormRootProps<T extends FieldValues = FieldValues> {
  children: React.ReactNode;
  onSubmit: (values: T) => void;
  form: UseFormReturn<T>;
  className?: string;
}

export function FormRoot<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  form,
  className,
}: FormRootProps<T>) {
  useEffect(() => {
    const errors = form.formState.errors;
    const errorEntries = Object.entries(errors);

    if (errorEntries.length > 0) {
      const findFirstErrorMessage = (obj: any): string | null => {
        if (typeof obj === "object" && obj !== null) {
          if (obj.message) {
            return obj.message;
          }

          if (Array.isArray(obj)) {
            for (const item of obj) {
              const message = findFirstErrorMessage(item);
              if (message) return message;
            }
          } else {
            for (const value of Object.values(obj)) {
              const message = findFirstErrorMessage(value);
              if (message) return message;
            }
          }
        }
        return null;
      };

      const firstErrorMessage = findFirstErrorMessage(errors);
      if (firstErrorMessage) {
        toast.error(String(firstErrorMessage), {
          id: "form-validation-error",
        });
      }
    }
  }, [form.formState.errors]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-2 w-full", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
