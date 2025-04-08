
import React, { useEffect, useState } from 'react';

interface TrainAnimationProps {
  number: number;
  maxNumber: number;
  isMoving: boolean;
}

const TrainAnimation: React.FC<TrainAnimationProps> = ({ number, maxNumber, isMoving }) => {
  const [position, setPosition] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  
  useEffect(() => {
    if (isMoving) {
      // Calculate position percentage based on number value
      const newPosition = (number / maxNumber) * 85; // 85% to leave some space
      setPosition(0); // Reset position first for animation
      
      setTimeout(() => {
        setPosition(newPosition);
      }, 100);
      
      // Show sparkle when train reaches its destination
      setTimeout(() => {
        setShowSparkle(true);
      }, 1200);
    } else {
      setPosition(0);
      setShowSparkle(false);
    }
  }, [number, maxNumber, isMoving]);

  return (
    <div className="relative h-20 w-full my-4">
      <div className="absolute h-4 bg-magic-light-purple rounded-full w-[90%] bottom-0"></div>
      
      <div 
        className="absolute bottom-2 transition-all duration-1000 ease-in-out"
        style={{ left: `${position}%` }}
      >
        <div className="flex items-center">
          <div className="w-14 h-10 bg-magic-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold">🚂</span>
          </div>
          <div className={`${number >= 10 ? 'w-10' : 'w-6'} h-6 bg-magic-yellow rounded-md ml-1 flex items-center justify-center`}>
            <span className={`${number >= 10 ? 'text-xs' : 'text-sm'} font-bold`}>{number}</span>
          </div>
          
          {/* Sparkle effect */}
          {showSparkle && (
            <div className="absolute -right-3 -top-4">
              <span className="text-xl animate-pulse">✨</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainAnimation;
