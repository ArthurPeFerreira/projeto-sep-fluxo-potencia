"use client";

import React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils/utils";

interface FormItemProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends ControllerProps<TFieldValues, TName> {
  className?: string;
}

export function FormItem<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  className,
  ...props
}: FormItemProps<TFieldValues, TName>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Controller {...props} />
    </div>
  );
}
