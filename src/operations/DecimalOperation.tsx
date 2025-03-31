import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { toast } from "@/hooks/use-toast";

interface DecimalOperationProps {
  onComplete: () => void;
}

const DecimalOperation: React.FC<DecimalOperationProps> = ({ onComplete }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, result: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableProblem, setEditableProblem] = useState({ num1: 0, num2: 0 });
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  
  useEffect(() => {
    generateDecimalProblem();
  }, []);
  
  const generateDecimalProblem = () => {
    // Generate random decimal numbers between 0 and 10 with 1 decimal place
    const num1 = Math.round((Math.random() * 10) * 10) / 10;
    const num2 = Math.round((Math.random() * 10) * 10) / 10;
    
    setProblem({
      num1,
      num2,
      result: operation === 'add' ? num1 + num2 : num1 - num2
    });
    setEditableProblem({ num1, num2 });
    setCurrentStep(0);
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  };
  
  const handleCustomProblem = () => {
    try {
      if (operation === 'subtract' && editableProblem.num1 < editableProblem.num2) {
        toast({
          title: "Invalid subtraction",
          description: "First number must be greater than or equal to second number",
          variant: "destructive",
        });
        return;
      }
      
      const result = operation === 'add' 
        ? editableProblem.num1 + editableProblem.num2 
        : editableProblem.num1 - editableProblem.num2;
      
      setProblem({
        num1: editableProblem.num1,
        num2: editableProblem.num2,
        result
      });
      
      setCurrentStep(0);
      setCompleted(false);
      setShowHint(false);
      setIsCustomProblem(true);
      
      toast({
        title: "Custom problem created!",
        description: `${editableProblem.num1} ${operation === 'add' ? '+' : '-'} ${editableProblem.num2} = ${result}`,
      });
    } catch (error) {
      toast({
        title: "Error creating problem",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
    }
  };
  
  const handleEditNum1 = (value: string) => {
    const newNum1 = parseFloat(value);
    if (!isNaN(newNum1)) {
      setEditableProblem(prev => ({ ...prev, num1: newNum1 }));
    }
  };
  
  const handleEditNum2 = (value: string) => {
    const newNum2 = parseFloat(value);
    if (!isNaN(newNum2)) {
      setEditableProblem(prev => ({ ...prev, num2: newNum2 }));
    }
  };
  
  const formatDecimal = (num: number) => {
    return num.toFixed(1);
  };
  
  // Determine steps based on problem
  const steps = [
    {
      instruction: `Let's ${operation === 'add' ? 'add' : 'subtract'} these decimal numbers`,
      voice: `Let's ${operation === 'add' ? 'add' : 'subtract'} ${formatDecimal(problem.num1)} and ${formatDecimal(problem.num2)}.`
    },
    {
      instruction: "First, align the decimal points",
      voice: "First, we need to align the decimal points to make sure we're adding or subtracting the same place values."
    },
    {
      instruction: `${operation === 'add' ? 'Add' : 'Subtract'} the tenths place`,
      voice: `${operation === 'add' ? 'Add' : 'Subtract'} the numbers in the tenths place: ${(problem.num1 * 10) % 10} ${operation === 'add' ? '+' : '-'} ${(problem.num2 * 10) % 10} = ${(problem.result * 10) % 10}`
    },
    {
      instruction: `${operation === 'add' ? 'Add' : 'Subtract'} the ones place`,
      voice: `${operation === 'add' ? 'Add' : 'Subtract'} the numbers in the ones place: ${Math.floor(problem.num1)} ${operation === 'add' ? '+' : '-'} ${Math.floor(problem.num2)} = ${Math.floor(problem.result)}`
    },
    {
      instruction: "Combine the results",
      voice: `The final result is ${formatDecimal(problem.result)}.`
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
          <span className="text-xl font-medium">{operation === 'add' ? '+' : '−'}</span>
        </div>
        <div className="col-span-3">
          <NumberBlock 
            value={isCustomProblem ? problem.num1 : editableProblem.num1} 
            highlighted={currentStep > 0}
            editable={!isCustomProblem}
            onChange={handleEditNum1}
          />
        </div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3">
          <NumberBlock 
            value={isCustomProblem ? problem.num2 : editableProblem.num2} 
            highlighted={currentStep > 0}
            editable={!isCustomProblem}
            onChange={handleEditNum2}
          />
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3">
          <StepAnimation step={4} currentStep={currentStep}>
            <NumberBlock 
              value={problem.result} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button
          variant={operation === 'add' ? 'default' : 'outline'}
          onClick={() => setOperation('add')}
        >
          Addition
        </Button>
        <Button
          variant={operation === 'subtract' ? 'default' : 'outline'}
          onClick={() => setOperation('subtract')}
        >
          Subtraction
        </Button>
      </div>
      
      {!isCustomProblem && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleCustomProblem}
            className="bg-mathBlue bg-opacity-10 text-mathBlue hover:bg-mathBlue hover:text-white"
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

export default DecimalOperation; 