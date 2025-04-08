
import React, { useState, useEffect } from 'react';

interface CrocMouthProps {
  number1: number;
  number2: number;
  showResult: boolean;
}

const CrocMouth: React.FC<CrocMouthProps> = ({ number1, number2, showResult }) => {
  const [mouthDirection, setMouthDirection] = useState<'left' | 'right' | 'equal'>('equal');
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (showResult) {
      if (number1 > number2) {
        setMouthDirection('left');
      } else if (number1 < number2) {
        setMouthDirection('right');
      } else {
        setMouthDirection('equal');
      }
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [number1, number2, showResult]);

  return (
    <div className="flex items-center justify-center my-6 h-24">
      <div className="flex items-center space-x-8">
        <div className="bg-magic-yellow w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold z-10">
          {number1}
        </div>
        
        <div className="relative w-24 h-20">
          {mouthDirection === 'equal' ? (
            <div className="bg-magic-green p-2 rounded-full animate-scale-up">
              <div className="text-center text-2xl">🐊</div>
              <div className="text-center text-sm font-bold">equal</div>
            </div>
          ) : (
            <div 
              className={`${isAnimating ? 'animate-open-mouth' : ''}`} 
              style={{ 
                transformOrigin: mouthDirection === 'left' ? 'left center' : 'right center',
                transform: `scaleX(${mouthDirection === 'left' ? 1 : -1})`
              }}
            >
              <div className="text-4xl">🐊</div>
            </div>
          )}
        </div>
        
        <div className="bg-magic-pink w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold z-10">
          {number2}
        </div>
      </div>
    </div>
  );
};

export default CrocMouth;
