
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepAnimationProps {
  step: number;
  currentStep: number;
  children: React.ReactNode;
  delay?: number;
}

const StepAnimation: React.FC<StepAnimationProps> = ({ 
  step, 
  currentStep, 
  children, 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (currentStep >= step) {
      timeout = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(false);
    }
    
    return () => clearTimeout(timeout);
  }, [currentStep, step, delay]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepAnimation;
