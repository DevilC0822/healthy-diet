"use client";

import { cn } from "@heroui/react";
import React from "react";

interface AuroraTextProps {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AuroraText({
  className,
  children,
  ...props
}: AuroraTextProps) {

  return (
    <span
      className={cn(
        "bg-gradient-to-r from-[hsl(var(--color-1))] via-[hsl(var(--color-3))] to-[hsl(var(--color-2))] bg-clip-text text-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
