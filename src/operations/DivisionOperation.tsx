
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateDivisionProblem } from '../utils/mathProblems';

interface DivisionOperationProps {
  onComplete: () => void;
  difficulty: string;
}

const DivisionOperation: React.FC<DivisionOperationProps> = ({ onComplete, difficulty }) => {
  const [problem, setProblem] = useState({ dividend: 0, divisor: 0, quotient: 0, remainder: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [steps, setSteps] = useState<Array<{ instruction: string; voice: string }>>([]);
  const [subtractions, setSubtractions] = useState<Array<{ value: number; step: number }>>([]);
  const [remainders, setRemainders] = useState<Array<{ value: number; step: number }>>([]);
  
  useEffect(() => {
    const newProblem = generateDivisionProblem(difficulty);
    setProblem(newProblem);
    setCurrentStep(0);
    setCompleted(false);
    setShowHint(false);
    
    const { steps, subtractions, remainders } = generateDivisionSteps(
      newProblem.dividend, 
      newProblem.divisor, 
      newProblem.quotient, 
      newProblem.remainder
    );
    
    setSteps(steps);
    setSubtractions(subtractions);
    setRemainders(remainders);
  }, [difficulty]);
  
  const generateDivisionSteps = (dividend: number, divisor: number, quotient: number, remainder: number) => {
    const steps: Array<{ instruction: string; voice: string }> = [
      {
        instruction: "Let's divide step by step",
        voice: `Let's divide ${dividend} by ${divisor} step by step.`
      }
    ];
    
    // For simple division problems, show a more visual approach
    if (difficulty === 'easy') {
      steps.push({
        instruction: `We need to find how many groups of ${divisor} are in ${dividend}`,
        voice: `We need to find how many groups of ${divisor} fit into ${dividend}.`
      });
      
      steps.push({
        instruction: `${dividend} ÷ ${divisor} = ${quotient} with remainder ${remainder}`,
        voice: `${dividend} divided by ${divisor} equals ${quotient} with a remainder of ${remainder}.`
      });
      
      return { 
        steps, 
        subtractions: [{ value: dividend, step: 1 }], 
        remainders: [{ value: remainder, step: 2 }]
      };
    }
    
    // For more complex division, show long division steps
    const dividendStr = dividend.toString();
    const quotientStr = quotient.toString();
    const subtractions: Array<{ value: number; step: number }> = [];
    const remainders: Array<{ value: number; step: number }> = [];
    
    let currentValue = 0;
    let stepCount = 1;
    
    for (let i = 0; i < dividendStr.length; i++) {
      currentValue = currentValue * 10 + parseInt(dividendStr[i], 10);
      
      if (currentValue < divisor && i < dividendStr.length - 1) {
        continue;
      }
      
      const digitQuotient = Math.floor(currentValue / divisor);
      const digitIndex = quotientStr.length - (dividendStr.length - i);
      
      if (digitIndex >= 0) {
        steps.push({
          instruction: `Divide ${currentValue} by ${divisor}`,
          voice: `Divide ${currentValue} by ${divisor}, which gives ${digitQuotient} with a remainder of ${currentValue % divisor}.`
        });
        
        subtractions.push({ value: divisor * digitQuotient, step: stepCount });
        stepCount++;
        
        currentValue = currentValue - (divisor * digitQuotient);
        remainders.push({ value: currentValue, step: stepCount - 1 });
        
        if (i < dividendStr.length - 1) {
          steps.push({
            instruction: `Bring down the next digit`,
            voice: `Bring down the next digit, ${dividendStr[i+1]}.`
          });
          stepCount++;
        }
      }
    }
    
    steps.push({
      instruction: `The final quotient is ${quotient} with remainder ${remainder}`,
      voice: `The final answer is ${quotient} with a remainder of ${remainder}.`
    });
    
    return { steps, subtractions, remainders };
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prevStep => prevStep + 1);
      speakInstruction(steps[currentStep].voice);
      
      if (currentStep === steps.length - 1) {
        setCompleted(true);
        onComplete();
      }
    }
  };
  
  const speakInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower
      utterance.pitch = 1.1; // Slightly higher pitch (kid-friendly)
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Render visuals for simple division (easier difficulty)
  const renderEasyDivision = () => {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8">
        <StepAnimation step={1} currentStep={currentStep}>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Array.from({ length: problem.dividend }).map((_, index) => (
              <motion.div
                key={index}
                className={`w-6 h-6 rounded-full ${
                  index < problem.divisor * problem.quotient 
                    ? 'bg-mathPurple' 
                    : 'bg-mathPink'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.02,
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }}
              />
            ))}
          </div>
        </StepAnimation>
        
        <StepAnimation step={2} currentStep={currentStep}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4 justify-items-center">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Dividend</div>
                <NumberBlock value={problem.dividend} />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Divisor</div>
                <NumberBlock value={problem.divisor} />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Groups</div>
                <NumberBlock value={problem.quotient} color="bg-mathGreen bg-opacity-20" />
              </div>
            </div>
            
            {problem.remainder > 0 && (
              <div className="text-center mt-2">
                <div className="text-sm text-muted-foreground mb-1">Remainder</div>
                <NumberBlock 
                  value={problem.remainder} 
                  color="bg-mathPink bg-opacity-20" 
                  className="mx-auto"
                />
              </div>
            )}
          </div>
        </StepAnimation>
      </div>
    );
  };
  
  // Render visuals for long division (medium/hard difficulty)
  const renderLongDivision = () => {
    return (
      <div className="grid grid-cols-10 gap-2 mb-8">
        {/* Long division symbol with divisor */}
        <div className="col-span-2 flex justify-end items-start pt-2">
          <NumberBlock value={problem.divisor} />
        </div>
        
        <div className="col-span-8 border-t-2 border-l-2 border-gray-400 pl-4 pt-2">
          {/* Dividend */}
          <div className="flex justify-center mb-4">
            <NumberBlock value={problem.dividend} />
          </div>
          
          {/* Subtractions and remainders */}
          <div className="flex flex-col gap-2">
            {subtractions.map((sub, index) => (
              <StepAnimation key={index} step={sub.step} currentStep={currentStep}>
                <div className="flex justify-center">
                  <NumberBlock 
                    value={sub.value} 
                    color="bg-mathPink bg-opacity-20" 
                  />
                </div>
                <div className="border-t-2 border-gray-400 my-1"></div>
                {remainders[index] && (
                  <div className="flex justify-center">
                    <NumberBlock 
                      value={remainders[index].value} 
                      color={index === remainders.length - 1 && completed ? "bg-mathGreen bg-opacity-20" : "bg-white"} 
                    />
                  </div>
                )}
              </StepAnimation>
            ))}
          </div>
        </div>
        
        {/* Quotient on top */}
        <div className="col-span-10 flex justify-center mt-4">
          <StepAnimation step={steps.length - 1} currentStep={currentStep}>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Quotient</div>
              <NumberBlock 
                value={problem.quotient} 
                color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"} 
              />
              {problem.remainder > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Remainder: {problem.remainder}
                </div>
              )}
            </div>
          </StepAnimation>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-end w-full mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => speakInstruction(steps[currentStep]?.voice || steps[0].voice)}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-8 text-center">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">
          {currentStep < steps.length ? steps[currentStep].instruction : steps[steps.length - 1].instruction}
        </h3>
        {showHint && (
          <p className="text-sm text-muted-foreground">
            {steps[currentStep]?.voice}
          </p>
        )}
      </div>
      
      {difficulty === 'easy' ? renderEasyDivision() : renderLongDivision()}
      
      <div className="flex flex-col gap-4 items-center">
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Button 
              className="bg-mathGreen hover:bg-mathGreen/90 px-8"
              onClick={() => window.location.reload()}
            >
              <Check className="h-5 w-5 mr-2" />
              Great job!
            </Button>
          </motion.div>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            <Button onClick={handleNextStep}>
              Next Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionOperation;
