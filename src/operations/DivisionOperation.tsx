import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateDivisionProblem } from '../utils/mathProblems';

interface DivisionOperationProps {
  onComplete: () => void;
}

const DivisionOperation: React.FC<DivisionOperationProps> = ({ onComplete }) => {
  const [problem, setProblem] = useState({ dividend: 0, divisor: 0, quotient: 0, remainder: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [partialQuotients, setPartialQuotients] = useState<number[]>([]);
  
  useEffect(() => {
    const newProblem = generateDivisionProblem("1");
    setProblem(newProblem);
    setCurrentStep(0);
    setCompleted(false);
    setShowHint(false);
    setPartialQuotients(calculatePartialQuotients(newProblem.dividend, newProblem.divisor));
  }, []);
  
  const calculatePartialQuotients = (dividend: number, divisor: number) => {
    const quotients: number[] = [];
    let remaining = dividend;
    
    while (remaining >= divisor) {
      const quotient = Math.floor(remaining / divisor);
      quotients.push(quotient);
      remaining -= quotient * divisor;
    }
    
    return quotients;
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };
  
  const steps = [
    {
      instruction: "Let's divide these numbers step by step",
      voice: `Let's divide ${problem.dividend} by ${problem.divisor} step by step.`
    },
    ...partialQuotients.map((quotient, index) => ({
      instruction: `Divide ${problem.dividend - (index > 0 ? partialQuotients.slice(0, index).reduce((a, b) => a + b, 0) * problem.divisor : 0)} by ${problem.divisor}`,
      voice: `Divide ${problem.dividend - (index > 0 ? partialQuotients.slice(0, index).reduce((a, b) => a + b, 0) * problem.divisor : 0)} by ${problem.divisor} to get ${quotient}.`
    })),
    {
      instruction: "Calculate the remainder",
      voice: `The remainder is ${problem.remainder}.`
    }
  ];
  
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
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
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
      
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="col-span-1 flex justify-end items-center">
          <span className="text-xl font-medium">÷</span>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {[2, 1, 0].map((place) => (
            <NumberBlock 
              key={place}
              value={getDigit(problem.dividend, place)} 
              highlighted={currentStep > 0}
            />
          ))}
        </div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {[2, 1, 0].map((place) => (
            <NumberBlock 
              key={place}
              value={getDigit(problem.divisor, place)} 
              highlighted={currentStep > 0}
            />
          ))}
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        {/* Show partial quotients */}
        {partialQuotients.map((quotient, index) => (
          <React.Fragment key={index}>
            <div className="col-span-1"></div>
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <StepAnimation step={index + 1} currentStep={currentStep}>
                <NumberBlock 
                  value={getDigit(quotient, 2)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(quotient, 1)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(quotient, 0)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
              </StepAnimation>
            </div>
          </React.Fragment>
        ))}
        
        {/* Final quotient and remainder */}
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-4 gap-3">
          <StepAnimation step={steps.length - 1} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.quotient, 3)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.quotient, 2)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.quotient, 1)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.quotient, 0)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
        
        {problem.remainder > 0 && (
          <>
            <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
            <div className="col-span-1"></div>
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <StepAnimation step={steps.length} currentStep={currentStep}>
                <NumberBlock 
                  value={getDigit(problem.remainder, 2)} 
                  color={completed ? "bg-mathOrange bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(problem.remainder, 1)} 
                  color={completed ? "bg-mathOrange bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(problem.remainder, 0)} 
                  color={completed ? "bg-mathOrange bg-opacity-20" : "bg-white"}
                />
              </StepAnimation>
            </div>
          </>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4">
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
