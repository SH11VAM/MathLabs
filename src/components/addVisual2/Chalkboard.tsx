        

import React from 'react';

interface ChalkboardProps {
  problem: string;
  answer: number;
  showAnswer: boolean;
}

const Chalkboard: React.FC<ChalkboardProps> = ({ problem, answer, showAnswer }) => {
  return (
    <div className="relative bg-kid-chalkboard rounded-xl p-6 shadow-lg border-4 border-gray-700">
      <div className="flex flex-col items-center">
        <div className="chalk-text text-kid-chalk font-marker text-2xl md:text-4xl mb-4">
          {problem}
        </div>
        
        <div className="w-full border-b-2 border-dashed border-gray-400 my-2"></div>
        
        {showAnswer ? (
          <div className="chalk-text text-kid-chalk font-marker text-3xl md:text-5xl mt-2 relative">
            {answer}
            
            {/* Decorative fireworks around the answer */}
            <div className="absolute -top-6 -left-6 text-kid-yellow animate-firework" style={{ animationDelay: '0.2s' }}>
              ✨
            </div>
            <div className="absolute -top-8 left-1/2 text-kid-red animate-firework" style={{ animationDelay: '0.4s' }}>
              ✨
            </div>
            <div className="absolute -top-6 -right-6 text-kid-green animate-firework" style={{ animationDelay: '0.6s' }}>
              ✨
            </div>
            <div className="absolute top-2 -left-8 text-kid-purple animate-star">
              ★
            </div>
            <div className="absolute top-2 -right-8 text-kid-green animate-star" style={{ animationDelay: '1s' }}>
              ★
            </div>
          </div>
        ) : (
          <div className="chalk-text text-gray-600 font-marker text-3xl md:text-5xl mt-2">
            ?
          </div>
        )}
      </div>
      
      {/* Chalk holder */}
      <div className="absolute bottom-2 left-4 bg-white w-12 h-2 rounded"></div>
    </div>
  );
};

export default Chalkboard;
