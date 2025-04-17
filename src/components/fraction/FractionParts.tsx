
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FractionParts: React.FC = () => {
  const [isHighlighted, setIsHighlighted] = useState<'numerator' | 'denominator' | null>(null);

  return (
    <div className="bg-slate-200 rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-fuchsia-600 mb-4">
        Parts of a Fraction
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col items-center relative">
            {/* The fraction display */}
            <div className="flex flex-col items-center mb-6">
              {/* Numerator with highlight */}
              <motion.div 
                className={`text-6xl font-bold ${isHighlighted === 'numerator' ? 'text-kid-red animate-highlight' : 'text-kid-purple'}`}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setIsHighlighted('numerator')}
                onHoverEnd={() => setIsHighlighted(null)}
              >
                3
              </motion.div>
              
              {/* Fraction line */}
              <div className="w-16 h-1.5 bg-black my-1"></div>
              
              {/* Denominator with highlight */}
              <motion.div 
                className={`text-6xl font-bold ${isHighlighted === 'denominator' ? 'text-kid-red animate-highlight' : 'text-kid-purple'}`}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setIsHighlighted('denominator')}
                onHoverEnd={() => setIsHighlighted(null)}
              >
                4
              </motion.div>
            </div>
            
            {/* Labels with arrows pointing to the parts */}
            <div className="relative w-full">
              {/* Numerator label */}
              <motion.div 
                className={`absolute -top-52 -left-64 p-2 rounded-lg bg-white border-2 ${isHighlighted === 'numerator' ? 'border-kid-red' : 'border-kid-purple'}`}
                animate={isHighlighted === 'numerator' ? { y: [0, 5, 0] } : {}}
                transition={{ repeat: isHighlighted === 'numerator' ? Infinity : 0, duration: 1 }}
              >
                <p className="text-lg font-bold">Numerator</p>
                <p className="text-sm">How many parts we have</p>
              </motion.div>
              
              {/* Denominator label */}
              <motion.div 
                className={`absolute -top-12 -left-64 p-2 rounded-lg bg-white border-2 ${isHighlighted === 'denominator' ? 'border-kid-red' : 'border-kid-purple'}`}
                animate={isHighlighted === 'denominator' ? { y: [0, -5, 0] } : {}}
                transition={{ repeat: isHighlighted === 'denominator' ? Infinity : 0, duration: 1 }}
              >
                <p className="text-lg font-bold">Denominator</p>
                <p className="text-sm">Total equal parts</p>
              </motion.div>
              
              {/* Arrow for numerator */}
              <div className="absolute -top-36 -left-6 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 origin-left -rotate-42"> <img src="/arrow-left.png" alt="" /></div>
              </div>
              
              {/* Arrow for denominator */}
              <div className="absolute top-6  transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 origin-left -rotate-[80deg]"><img src="/upward-arrow.png" alt="" /></div>
              </div>
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:max-w-sm"
        >
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="text-2xl font-bold mb-3 text-kid-purple">How to Read This Fraction</h3>
            
            <p className="text-xl mb-4">
              We read <span className="font-bold text-kid-purple">3/4</span> as <span className="font-bold text-kid-red">"three-fourths"</span> or <span className="font-bold text-kid-red">"three quarters"</span>.
            </p>
            
            <div className="mt-4 bg-kid-yellow p-4 rounded-xl">
              <h4 className="text-xl font-bold mb-2">What This Means:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-lg">We have <span className="font-bold text-kid-red">3</span> parts</li>
                <li className="text-lg">Out of a total of <span className="font-bold text-kid-red">4</span> equal parts</li>
                <li className="text-lg">So we have <span className="font-bold text-kid-purple">3/4</span> of the whole</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FractionParts;
