import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { toast } from "@/hooks/use-toast";

interface FactorialOperationProps {
  onComplete: () => void;
}

const FactorialOperation: React.FC<FactorialOperationProps> = ({ onComplete }) => {
  const [number, setNumber] = useState(5); // Default to 5!
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableNumber, setEditableNumber] = useState(5);
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [intermediateResults, setIntermediateResults] = useState<number[]>([]);
  
  useEffect(() => {
    generateFactorialProblem(5);
  }, []);
  
  const generateFactorialProblem = (n: number) => {
    if (n < 0 || n > 10) {
      toast({
        title: "Invalid number",
        description: "Please enter a number between 0 and 10",
        variant: "destructive",
      });
      return;
    }
    
    const results: number[] = [];
    let factorial = 1;
    
    for (let i = 1; i <= n; i++) {
      factorial *= i;
      results.push(factorial);
    }
    
    setNumber(n);
    setEditableNumber(n);
    setIntermediateResults(results);
    setCurrentStep(0);
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  };
  
  const handleCustomProblem = () => {
    generateFactorialProblem(editableNumber);
  };
  
  const handleEditNumber = (value: string) => {
    const newNumber = parseInt(value);
    if (!isNaN(newNumber)) {
      setEditableNumber(newNumber);
    }
  };
  
  // Determine steps based on problem
  const steps = [
    {
      instruction: `Let's calculate ${number}! (${number} factorial)`,
      voice: `Let's calculate ${number} factorial, which means multiplying all numbers from 1 to ${number}.`
    },
    ...Array.from({ length: number }, (_, i) => ({
      instruction: `Multiply by ${i + 1}`,
      voice: `Multiply ${i === 0 ? 1 : intermediateResults[i - 1]} by ${i + 1} to get ${intermediateResults[i]}.`
    })),
    {
      instruction: "Find the final result",
      voice: `The final result is ${intermediateResults[intermediateResults.length - 1]}.`
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
          <span className="text-xl font-medium">{number}!</span>
        </div>
        <div className="col-span-3">
          <NumberBlock 
            value={isCustomProblem ? number : editableNumber} 
            highlighted={currentStep > 0}
            editable={!isCustomProblem}
            onChange={handleEditNumber}
          />
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3">
          <StepAnimation step={steps.length - 1} currentStep={currentStep}>
            <NumberBlock 
              value={intermediateResults[intermediateResults.length - 1] || 0} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
      </div>
      
      {/* Show intermediate steps */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {intermediateResults.map((result, index) => (
          <StepAnimation key={index} step={index + 1} currentStep={currentStep}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {index + 1} × {index === 0 ? 1 : intermediateResults[index - 1]} =
              </span>
              <NumberBlock 
                value={result} 
                color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
              />
            </div>
          </StepAnimation>
        ))}
      </div>
      
      {!isCustomProblem && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleCustomProblem}
            className="bg-mathPurple bg-opacity-10 text-mathPurple hover:bg-mathPurple hover:text-white"
          >
            Create Custom Problem
          </Button>
        </div>
      )}
      
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

export default FactorialOperation; 