
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FractionIntroduction: React.FC = () => {
  const [showSlices, setShowSlices] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const slicesTimer = setTimeout(() => setShowSlices(true), 3500);
    const labelsTimer = setTimeout(() => setShowLabels(true), 3000);
    
    return () => {
      clearTimeout(slicesTimer);
      clearTimeout(labelsTimer);
    };
  }, []);

  return (
    <div className="bg-kid-green rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-white mb-4">
        What is a Fraction?
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="relative w-48 h-48">
          {/* Whole pizza */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <div className="w-full h-full rounded-full bg-kid-yellow border-4 border-kid-orange flex items-center justify-center">
              {!showSlices && (
                <span className="text-2xl font-bold">1 Whole</span>
              )}
            </div>
          </motion.div>
          
          {/* Pizza slices */}
          {showSlices && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
                className="absolute inset-0"
              >
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-kid-orange">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-kid-yellow border-r-2 border-kid-orange rounded-l-full"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-kid-orange  rounded-r-full"></div>
                  {/* <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-0.5 bg-kid-orange absolute top-1/2 transform -translate-y-1/2">jj</div>
                  </div> */}
                </div>
              </motion.div>
              
              {showLabels && (
                <>
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="absolute left-[20px] top-1/3 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-3 py-1 border-2 border-kid-red"
                  >
                    <span className="text-lg font-bold">1/2</span>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute right-[20px] top-1/3 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-3 py-1 border-2 border-kid-red"
                  >
                    <span className="text-lg font-bold">1/2</span>
                  </motion.div>
                </>
              )}
            </>
          )}
        </div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-md bg-white rounded-xl p-4 shadow-md"
        >
          <p className="text-xl">
            A <span className="font-bold text-kid-blue">fraction</span> shows parts of a whole. 
            When we divide something into equal parts, each part is a fraction of the whole!
          </p>
          
          {showSlices && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xl mt-3"
            >
              This pizza is cut into <span className="font-bold text-kid-red">2 equal parts</span>. 
              Each piece is <span className="font-bold text-kid-purple">one-half</span> of the whole pizza.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FractionIntroduction;
