
import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceValueBlocksProps {
  tens: number;
  ones: number;
  className?: string;
}

const PlaceValueBlocks: React.FC<PlaceValueBlocksProps> = ({ tens, ones, className }) => {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex flex-row gap-2 justify-center">
        {Array.from({ length: tens }).map((_, index) => (
          <div 
            key={`ten-${index}`} 
            className="place-value-block bg-kid-blue w-8 h-24 rounded border-2 border-blue-600 animate-bounce-in flex flex-col justify-between"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="text-xs text-white block text-center mt-2">Tens</span>
            <span className="text-xs text-white block text-center mb-2">10</span>
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 justify-center flex-wrap max-w-[200px]">
        {Array.from({ length: ones }).map((_, index) => (
          <div 
            key={`one-${index}`} 
            className="place-value-block bg-kid-red w-10 h-10 rounded border-2 border-red-600 animate-bounce-in flex flex-col justify-between"
            style={{ animationDelay: `${index * 0.1 + tens * 0.1}s` }}
          >
            <span className="text-xs text-white block text-center mt-1">Ones</span>
            <span className="text-xs text-white block text-center mb-1">1</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceValueBlocks;
