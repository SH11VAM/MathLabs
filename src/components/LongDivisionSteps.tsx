import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DivisionStep {
  step: number;
  type: string;
  position?: number;
  currentDividend?: string;
  divisor?: string;
  quotientDigit?: string;
  currentQuotient?: string;
  multiply?: number;
  subtract?: number;
  remainingDividend?: string;
  description: string;
  quotient?: string;
  remainder?: number;
}

interface LongDivisionStepsProps {
  steps: DivisionStep[];
  dividend: string;
  divisor: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const LongDivisionSteps: React.FC<LongDivisionStepsProps> = ({ steps, dividend, divisor }) => {
  const lastStep = steps[steps.length - 1];
  const isFinalStep = lastStep.type === 'final';
  
  // Helper function to calculate character position
  const getCharPosition = (position: number) => {
    return `${position * 1.65}ch`;
  };

  return (
    <div className="font-mono text-lg">
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner relative overflow-x-auto">
        {/* Step description */}
        <motion.div 
          className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-base font-sans rounded-r-md"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          key={lastStep.step}
        >
          <p className="text-blue-800 font-medium">{lastStep.description}</p>
          {lastStep.type === 'divide' && (
            <div className="mt-2 text-sm text-blue-600 flex flex-col sm:flex-row sm:gap-4">
              <span>Divisor: <strong>{divisor}</strong></span>
              <span>Current Value: <strong>{lastStep.currentDividend}</strong></span>
              {lastStep.quotientDigit && <span>Quotient Digit: <strong>{lastStep.quotientDigit}</strong></span>}
            </div>
          )}
        </motion.div>
        
        {/* Long division visualization */}
        <div className="relative min-h-[200px] whitespace-nowrap pb-8">
          {/* Divisor */}
          <div className="absolute top-2 left-0 font-bold">
            {divisor}
          </div>
          
          {/* Division bracket */}
          <div className="absolute top-0 left-8 h-full border-t-2 border-l-2 border-black pt-1 pl-4">
            {/* Quotient at the top of bracket */}
            <div className="absolute top-[-25px] left-0">
              {steps.filter(s => s.type !== 'final').map((step, idx) => (
                <motion.span 
                  key={idx} 
                  className={cn(
                    "absolute font-bold", 
                    {"text-green-600": step.step === lastStep.step && step.type !== 'final'}
                  )}
                  style={{ left: getCharPosition(step.position || 0) }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * idx, duration: 0.3 }}
                >
                  {step.quotientDigit}
                </motion.span>
              ))}
            </div>
            
            {/* Dividend */}
            <div className="relative">
              {dividend.split('').map((digit, idx) => (
                <span 
                  key={idx} 
                  className="relative inline-block w-[2ch] text-center font-bold"
                >
                  {digit}
                </span>
              ))}
            </div>
            
            {/* Calculation steps */}
            <div className="mt-2">
              {steps.filter(s => s.type !== 'final').map((step, idx) => {
                if (!step.position && step.position !== 0) return null;
                
                const startPosition = step.position || 0;
                const width = String(step.multiply || '').length;
                
                return (
                  <div key={idx} className="relative">
                    {/* Multiplication result under the dividend */}
                    {/* {step.multiply !== undefined && (
                      <motion.div 
                        className={cn(
                          "absolute whitespace-nowrap",
                          {"font-bold text-red-600": step.step === lastStep.step && step.type !== 'final'}
                        )}
                        style={{ 
                          left: getCharPosition(startPosition),
                          top: `${idx * 3}rem` 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        {step.currentDividend}
                      </motion.div>
                    )} */}
                    
                    {/* Horizontal line after multiplication */}
                    {/* {step.multiply !== undefined && (
                      <motion.div 
                        className={cn(
                          "absolute border-t border-black",
                          {"border-red-600 border-t-2": step.step === lastStep.step && step.type !== 'final'}
                        )}
                        style={{ 
                          left: getCharPosition(startPosition),
                          top: `${idx * 3 + 1.5}rem`,
                          width: `${width + 1}ch` 
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      ></motion.div>
                    )} */}
                    
                    {/* Vertical subtraction */}
                    {step.subtract !== undefined && (
                      <motion.div 
                        className={cn(
                          "absolute whitespace-nowrap",
                          {"font-bold text-cyan-500": step.step === lastStep.step && step.type !== 'final'}
                        )}
                        style={{ 
                          left: getCharPosition(startPosition),
                          top: `${step.step==2?`${idx * 3 + step.step*1.3}`:`${idx * 3 + step.step*.5}`}rem` 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <div className="flex flex-col items-end">
                       
                        <div>{step.step == 0? "": step.currentDividend}</div>
                          <div className="text-red-600">-{step.multiply}</div>
                          <div className="border-t border-black w-full text-center">{step.subtract}</div>
                          <div className={`w-4 h-4 ${(step.step== lastStep.step) || isFinalStep ? "hidden": "block"}`}><img src='/right-arrow.png' alt='arrow'/></div>
                          
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Down arrow for bringing down next digit */}
                    {step.type === 'divide' && idx > 0 && (
                      <motion.div 
                        className={cn(
                          "absolute text-purple-600 text-3xl",
                          {"font-bold": step.step === lastStep.step}
                        )}
                        style={{ 
                          left: getCharPosition(startPosition),
                          top: `${step.step==2?`${idx*3.5}`:`${idx*2}`}rem` 
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        ↓
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Final result display */}
        {isFinalStep && (
          <motion.div 
            className="mt-14 p-4 bg-green-50 border-l-4 border-green-500 font-sans rounded-r-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xl font-bold text-green-800">
              Result:  {dividend} ÷ {divisor}  = {lastStep.quotient} 
              {lastStep.remainder && lastStep.remainder > 0 ? ` with remainder ${lastStep.remainder}` : ''}
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Verification: {divisor} × {lastStep.quotient} 
              {lastStep.remainder && lastStep.remainder > 0 ? ` + ${lastStep.remainder}` : ''} = {dividend}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LongDivisionSteps;
