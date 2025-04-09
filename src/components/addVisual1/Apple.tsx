

import React from "react";
import { cn } from "@/lib/utils";

interface AppleProps {
  className?: string;
  index: number;
}

export const Apple: React.FC<AppleProps> = ({ className, index }) => {
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
      {/* Apple body */}
      <div className="absolute w-8 h-8 bg-apple-red rounded-full shadow-lg left-2 top-4">
        {/* Apple highlight */}
        <div className="absolute w-3 h-2 bg-white/20 rounded-full left-2 top-4 transform rotate-45"></div>
      </div>
      
      {/* Apple stem */}
      <div className="absolute w-1 h-3 bg-green-800 rounded-sm left-6 top-2 transform -rotate-12"></div>
      
      {/* Apple leaf */}
      <div className="absolute w-3 h-1 bg-grass-green rounded-full left-8 top-3 transform -rotate-45 -skew-x-12"></div>
    </div>
  );
};
