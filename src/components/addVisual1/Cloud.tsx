
import React from "react";
import { cn } from "@/lib/utils";

interface CloudProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Cloud: React.FC<CloudProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-20 h-12",
    md: "w-32 h-20",
    lg: "w-48 h-28"
  };
  
  return (
    <div className={cn("relative animate-float", sizeClasses[size], className)}>
      <div className="absolute bg-cloud-white rounded-full w-full h-full opacity-90 shadow-sm"></div>
      <div className="absolute bg-cloud-white rounded-full w-3/4 h-full -left-1/4 top-1/4 opacity-90"></div>
      <div className="absolute bg-cloud-white rounded-full w-1/2 h-3/4 left-1/4 -top-1/4 opacity-90"></div>
      <div className="absolute bg-cloud-white rounded-full w-1/2 h-3/4 right-0 top-0 opacity-90"></div>
    </div>
  );
};
