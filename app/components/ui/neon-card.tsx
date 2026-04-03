"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/app/components/ui/card";
import { motion } from "framer-motion";

interface NeonCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  glowColor?: string;
  withSweep?: boolean;
  hoverBorderColor?: string;
}

export const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  (
    {
      className,
      children,
      glowColor = "bg-blue-600/40",
      hoverBorderColor = "hover:border-blue-500",
      withSweep = true,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full h-full"
      >
        {/* Neon Glow Effect behind the card */}
        <div
          className={cn(
            "absolute -inset-0.5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition duration-500",
            glowColor
          )}
        />

        <Card
          ref={ref}
          className={cn(
            "relative bg-slate-900/90 border-slate-700 transition-all backdrop-blur-md overflow-hidden h-full flex flex-col shadow-xl",
            hoverBorderColor,
            className
          )}
          {...props}
        >
          {children}

          {/* Sweep Animation */}
          {withSweep && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[sweep_1.5s_infinite] pointer-events-none" />
          )}
        </Card>
      </motion.div>
    );
  }
);
NeonCard.displayName = "NeonCard";
