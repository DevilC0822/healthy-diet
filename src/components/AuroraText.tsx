"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps } from "motion/react";
import React, { useEffect, useState } from "react";

interface AuroraTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

export function AuroraText({
  className,
  children,
  as: Component = "span",
  ...props
}: AuroraTextProps) {
  const MotionComponent = motion.create(Component);
  // 检测是否为 iOS 设备
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检测是否为 iOS 设备
    const checkIsIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    setIsIOS(checkIsIOS());
  }, []);

  return (
    <MotionComponent
      className={cn("relative inline-flex overflow-hidden", className)}
      {...props}
    >
      {/* iOS 设备使用不同的渐变文本实现 */}
      {isIOS ? (
        <span className="bg-gradient-to-r from-[hsl(var(--color-1))] via-[hsl(var(--color-3))] to-[hsl(var(--color-2))] bg-clip-text text-transparent">
          {children}
        </span>
      ) : (
        <>
          {children}
          <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
            <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]"></span>
            <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
            <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]"></span>
            <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
          </span>
        </>
      )}
    </MotionComponent>
  );
}
