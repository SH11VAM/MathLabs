
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateAdditionProblem } from '../utils/mathProblems';

interface AdditionOperationProps {
  onComplete: () => void;
  difficulty: string;
}

const AdditionOperation: React.FC<AdditionOperationProps> = ({ onComplete, difficulty }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, sum: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [carryValues, setCarryValues] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    const newProblem = generateAdditionProblem(difficulty);
    setProblem(newProblem);
    setCurrentStep(0);
    setCarryValues(calculateCarryValues(newProblem.num1, newProblem.num2));
    setCompleted(false);
    setShowHint(false);
  }, [difficulty]);
  
  const calculateCarryValues = (a: number, b: number) => {
    const carries: number[] = [];
    let carry = 0;
    
    const aStr = a.toString();
    const bStr = b.toString();
    const maxLength = Math.max(aStr.length, bStr.length);
    
    for (let i = 0; i < maxLength; i++) {
      const digitA = parseInt(aStr[aStr.length - 1 - i] || '0', 10);
      const digitB = parseInt(bStr[bStr.length - 1 - i] || '0', 10);
      const sum = digitA + digitB + carry;
      
      carry = sum >= 10 ? 1 : 0;
      carries.unshift(carry);
    }
    
    // Only return carries that are 1
    return carries.map((c, i) => c === 1 ? i : -1).filter(i => i !== -1);
  };
  
  const steps = [
    {
      instruction: "Let's add these numbers digit by digit",
      voice: "Let's add these numbers digit by digit, starting from the right side."
    },
    {
      instruction: "Add the ones place",
      voice: `Add the ones place: ${problem.num1 % 10} plus ${problem.num2 % 10} equals ${(problem.num1 % 10 + problem.num2 % 10) % 10}${(problem.num1 % 10 + problem.num2 % 10) >= 10 ? ' with a carry of 1' : ''}.`
    },
    ...(carryValues.length > 0 ? [
      {
        instruction: "Carry the 1 to the tens place",
        voice: "Carry the 1 to the tens place."
      }
    ] : []),
    {
      instruction: "Add the tens place",
      voice: `Add the tens place: ${Math.floor((problem.num1 % 100) / 10)} plus ${Math.floor((problem.num2 % 100) / 10)} ${carryValues.includes(1) ? 'plus the carried 1 ' : ''}equals ${Math.floor((problem.sum % 100) / 10)}.`
    },
    ...(carryValues.includes(0) ? [
      {
        instruction: "Carry the 1 to the hundreds place",
        voice: "Carry the 1 to the hundreds place."
      }
    ] : []),
    {
      instruction: "Find the total sum",
      voice: `The total sum is ${problem.sum}.`
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
      utterance.rate = 0.9; // Slightly slower
      utterance.pitch = 1.1; // Slightly higher pitch (kid-friendly)
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
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
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {carryValues.includes(0) && (
            <StepAnimation step={3} currentStep={currentStep} delay={500}>
              <div className="text-mathPink font-bold text-sm flex justify-center items-center h-6">
                <ArrowUp className="h-4 w-4 mr-1" />1
              </div>
            </StepAnimation>
          )}
          {carryValues.includes(1) && (
            <StepAnimation step={2} currentStep={currentStep} delay={500}>
              <div className="text-mathPink font-bold text-sm flex justify-center items-center h-6">
                <ArrowUp className="h-4 w-4 mr-1" />1
              </div>
            </StepAnimation>
          )}
          <div></div>
        </div>
        
        <div className="col-span-1 flex justify-end items-center">
          <span className="text-xl font-medium">+</span>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <NumberBlock 
            value={getDigit(problem.num1, 2)} 
            highlighted={currentStep >= 4 && carryValues.includes(0)}
          />
          <NumberBlock 
            value={getDigit(problem.num1, 1)} 
            highlighted={currentStep >= 3 && currentStep < 4}
          />
          <NumberBlock 
            value={getDigit(problem.num1, 0)} 
            highlighted={currentStep >= 1 && currentStep < 3}
          />
        </div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <NumberBlock 
            value={getDigit(problem.num2, 2)} 
            highlighted={currentStep >= 4 && carryValues.includes(0)}
          />
          <NumberBlock 
            value={getDigit(problem.num2, 1)} 
            highlighted={currentStep >= 3 && currentStep < 4}
          />
          <NumberBlock 
            value={getDigit(problem.num2, 0)} 
            highlighted={currentStep >= 1 && currentStep < 3}
          />
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <StepAnimation step={4} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.sum, 2)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
          <StepAnimation step={3} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.sum, 1)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
          <StepAnimation step={1} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.sum, 0)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
      </div>
      
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

export default AdditionOperation;
