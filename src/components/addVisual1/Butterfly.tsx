
import React from "react";

interface ButterflyProps {
  className?: string;
  color?: string;
}

export const Butterfly: React.FC<ButterflyProps> = ({ 
  className, 
  color = "#F1C40F" // Default to yellow
}) => {
  return (
    <div className={`relative w-12 h-10 animate-flutter ${className}`}>
      {/* Left wing */}
      <div 
        className="absolute left-0 w-5 h-8 rounded-tl-full rounded-bl-full" 
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Right wing */}
      <div 
        className="absolute right-0 w-5 h-8 rounded-tr-full rounded-br-full" 
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Body */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-10 bg-black rounded-full"></div>
      
      {/* Antennas */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 flex space-x-3">
        <div className="w-px h-3 bg-black transform -rotate-12"></div>
        <div className="w-px h-3 bg-black transform rotate-12"></div>
      </div>
    </div>
  );
};
