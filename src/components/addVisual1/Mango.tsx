import React from "react";
import { cn } from "@/lib/utils";

interface MangoProps {
  className?: string;
  index: number;
}

export const Mango: React.FC<MangoProps> = ({ className, index }) => {
  return (
    <div
      className={cn(
        "relative w-20 h-20",
        "transition-all duration-300 hover:scale-110",
        "animate-bounce-gentle",
        className
      )}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <img src="/mango.png" alt="Mango"  width="40" height="40"/>
    </div>
  );
};
