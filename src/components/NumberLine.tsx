
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface NumberLineProps {
  min: number;
  max: number;
  highlightNumbers?: number[];
}

const NumberLine: React.FC<NumberLineProps> = ({ min, max, highlightNumbers = [] }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animation for the numbers if needed
    const numberElements = lineRef.current?.querySelectorAll('.number-item');
    numberElements?.forEach((element, index) => {
      element.classList.add('animate-fade-in');
      (element as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full my-6">
      <div className="relative flex justify-center items-end py-8" ref={lineRef}>
        {/* The number line */}
        <div className="absolute h-4 bg-magic-purple rounded-full w-[90%] mt-4"></div>
        
        {/* Tick marks and numbers */}
        <div className="flex justify-between w-[90%] z-10">
          {numbers.map((num) => (
            <div 
              key={num} 
              className={`flex flex-col items-center number-item ${
                highlightNumbers.includes(num) 
                  ? 'scale-125 z-20' 
                  : ''
              }`}
            >
              <div 
                className={`h-8 w-2 bg-magic-purple mb-2 ${
                  highlightNumbers.includes(num) 
                    ? 'bg-magic-red' 
                    : ''
                }`}
              ></div>
              <span 
                className={`text-xl font-bold ${
                  highlightNumbers.includes(num) 
                    ? 'text-magic-red animate-jump' 
                    : ''
                }`}
              >
                {num}
              </span>
            </div>
          ))}
        </div>
        
        {/* Arrow pointing right */}
        <div className="absolute right-0 bottom-[28px] transform translate-x-2">
          <ArrowRight className="h-8 w-8 text-magic-purple animate-bounce-horizontal" />
        </div>
      </div>
      
      {/* Helper text */}
      <div className="flex justify-center text-lg font-medium mt-2 space-x-8">
        <span className="text-magic-purple">Smaller numbers on the left</span>
        <span className="text-magic-purple">Bigger numbers on the right</span>
      </div>
    </div>
  );
};

export default NumberLine;
