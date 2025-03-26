
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2, X as XIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateMultiplicationProblem } from '../utils/mathProblems';

interface MultiplicationOperationProps {
  onComplete: () => void;
  difficulty: string;
}

const MultiplicationOperation: React.FC<MultiplicationOperationProps> = ({ onComplete, difficulty }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, product: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [partialProducts, setPartialProducts] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    const newProblem = generateMultiplicationProblem(difficulty);
    setProblem(newProblem);
    setCurrentStep(0);
    setPartialProducts(calculatePartialProducts(newProblem.num1, newProblem.num2));
    setCompleted(false);
    setShowHint(false);
  }, [difficulty]);
  
  const calculatePartialProducts = (a: number, b: number) => {
    const products: number[] = [];
    const bStr = b.toString();
    
    for (let i = 0; i < bStr.length; i++) {
      const digit = parseInt(bStr[bStr.length - 1 - i], 10);
      const product = a * digit * Math.pow(10, i);
      products.push(product);
    }
    
    return products;
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };
  
  // Create steps based on problem complexity
  const steps = [
    {
      instruction: "Let's multiply these numbers step by step",
      voice: "Let's multiply these numbers step by step, working from right to left."
    },
    {
      instruction: `Multiply ${problem.num1} by ${getDigit(problem.num2, 0)}`,
      voice: `First, multiply ${problem.num1} by ${getDigit(problem.num2, 0)}, which gives us ${partialProducts[0]}.`
    },
    ...(problem.num2 >= 10 ? [
      {
        instruction: `Multiply ${problem.num1} by ${getDigit(problem.num2, 1)}`,
        voice: `Next, multiply ${problem.num1} by ${getDigit(problem.num2, 1)}. That's ${problem.num1 * getDigit(problem.num2, 1)}. But since this is in the tens place, we multiply by 10 to get ${partialProducts[1]}.`
      }
    ] : []),
    ...(problem.num2 >= 100 ? [
      {
        instruction: `Multiply ${problem.num1} by ${getDigit(problem.num2, 2)}`,
        voice: `Now, multiply ${problem.num1} by ${getDigit(problem.num2, 2)}. That's ${problem.num1 * getDigit(problem.num2, 2)}. Since this is in the hundreds place, we multiply by 100 to get ${partialProducts[2]}.`
      }
    ] : []),
    {
      instruction: "Add all the products together",
      voice: `Finally, add all these products together: ${partialProducts.join(' + ')} = ${problem.product}.`
    },
    {
      instruction: "The final product is " + problem.product,
      voice: `The final answer is ${problem.product}.`
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
          <span className="text-xl font-medium">×</span>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <NumberBlock 
            value={getDigit(problem.num1, 2)} 
            highlighted={currentStep >= 1 && currentStep <= partialProducts.length}
          />
          <NumberBlock 
            value={getDigit(problem.num1, 1)} 
            highlighted={currentStep >= 1 && currentStep <= partialProducts.length}
          />
          <NumberBlock 
            value={getDigit(problem.num1, 0)} 
            highlighted={currentStep >= 1 && currentStep <= partialProducts.length}
          />
        </div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <NumberBlock 
            value={getDigit(problem.num2, 2)} 
            highlighted={currentStep === 3}
          />
          <NumberBlock 
            value={getDigit(problem.num2, 1)} 
            highlighted={currentStep === 2}
          />
          <NumberBlock 
            value={getDigit(problem.num2, 0)} 
            highlighted={currentStep === 1}
          />
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        {/* Partial products */}
        {partialProducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="col-span-1"></div>
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <StepAnimation step={index + 1} currentStep={currentStep} delay={300 * index}>
                <div className="flex justify-end items-center h-16 md:h-20">
                  <span className="text-lg font-medium">{product}</span>
                </div>
              </StepAnimation>
            </div>
          </React.Fragment>
        ))}
        
        {partialProducts.length > 1 && (
          <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        )}
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <StepAnimation step={partialProducts.length + 1} currentStep={currentStep}>
            <div className="flex justify-end items-center h-16 md:h-20">
              <span className={`text-2xl font-bold ${completed ? 'text-mathGreen' : ''}`}>
                {problem.product}
              </span>
            </div>
          </StepAnimation>
        </div>
      </div>
      
      {/* Visual grid representation for smaller numbers */}
      {difficulty === 'easy' && problem.num1 <= 10 && problem.num2 <= 10 && (
        <StepAnimation step={1} currentStep={currentStep}>
          <div className="mb-8">
            <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
              {Array.from({ length: problem.num1 * problem.num2 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="w-6 h-6 bg-mathPurple bg-opacity-20 rounded-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.01,
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                />
              ))}
            </div>
            <div className="mt-2 text-center text-sm text-muted-foreground">
              {problem.num1} × {problem.num2} = {problem.product} squares
            </div>
          </div>
        </StepAnimation>
      )}
      
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

export default MultiplicationOperation;
