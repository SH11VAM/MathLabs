
import React, { useEffect, useState } from 'react';

interface RacingAnimalsProps {
  number1: number;
  number2: number;
  maxNumber: number;
  isRacing: boolean;
}

const RacingAnimals: React.FC<RacingAnimalsProps> = ({ 
  number1, 
  number2, 
  maxNumber, 
  isRacing 
}) => {
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(0);
  
  useEffect(() => {
    if (isRacing) {
      // Calculate positions based on number values
      const newPosition1 = (number1 / maxNumber) * 80;
      const newPosition2 = (number2 / maxNumber) * 80;
      
      setTimeout(() => {
        setPosition1(newPosition1);
        setPosition2(newPosition2);
      }, 500);
    } else {
      setPosition1(0);
      setPosition2(0);
    }
  }, [number1, number2, maxNumber, isRacing]);

  return (
    <div className="relative h-32 w-full my-6">
      {/* Tracks */}
      <div className="absolute h-4 bg-slate-400 rounded-full w-[90%] top-6"></div>
      <div className="absolute h-4 bg-slate-400 rounded-full w-[90%] bottom-6"></div>
      
      {/* Turtle */}
      <div 
        className="absolute top-0 transition-all duration-2000 ease-in-out"
        style={{ left: `${position1}%` }}
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl">🐢</span>
          <span className="bg-magic-yellow px-2 rounded-full text-sm font-bold">{number1}</span>
        </div>
      </div>
      
      {/* Rabbit */}
      <div 
        className="absolute bottom-0 transition-all duration-1500 ease-in-out"
        style={{ left: `${position2}%` }}
      >
        <div className="flex flex-col items-center mb-3">
          <span className="text-2xl">🐰</span>
          <span className="bg-magic-pink px-2 rounded-full text-sm font-bold">{number2}</span>
        </div>
      </div>
      
      {/* Finish line */}
      <div className="absolute right-[10%] top-0 h-full w-1 bg-magic-red"></div>
    </div>
  );
};

export default RacingAnimals;
