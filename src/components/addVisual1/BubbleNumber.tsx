
import React from "react";
import { cn } from "@/lib/utils";

interface BubbleNumberProps {
  number: string | number;
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  textColor?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const BubbleNumber: React.FC<BubbleNumberProps> = ({ 
  number, 
  className,
  color = "#3498DB", // Default to blue
  size = "md",
  animated = true,
  textColor = "white",
  glow = false,
  onClick
}) => {
  // Size classes mapping
  const sizeClasses = {
    sm: "w-6 h-6 text-2xl",
    md: "w-8 h-8 md:w-14 md:h-14 text-3xl md:text-5xl",
    lg: "w-10 h-10 md:w-14 md:h-14 text-4xl md:text-6xl",
    xl: "w-12 h-12 md:w-24 md:h-24 text-5xl md:text-7xl"
  };

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center",
        "rounded-full shadow-lg",
        "font-bubble font-bold",
        "transition-all duration-300 hover:scale-105",
        animated ? "animate-bounce-gentle" : "",
        glow ? "shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "",
        sizeClasses[size],
        "cursor-pointer",
        className
      )}
      style={{ 
        backgroundColor: color,
        color: textColor
      }}
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
    >
      {number}
      {/* Highlight */}
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/5 bg-white/30 rounded-full"></div>
    </div>
  );
};
