
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateSubtractionProblem } from '../utils/mathProblems';
import { toast } from "@/hooks/use-toast";

interface SubtractionOperationProps {
  onComplete: () => void;
  difficulty: string;
}

const SubtractionOperation: React.FC<SubtractionOperationProps> = ({ onComplete, difficulty }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, difference: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [borrowedPlaces, setBorrowedPlaces] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableProblem, setEditableProblem] = useState({ num1: 0, num2: 0 });
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  
  useEffect(() => {
    const newProblem = generateSubtractionProblem(difficulty);
    setProblem(newProblem);
    setEditableProblem({ num1: newProblem.num1, num2: newProblem.num2 });
    setCurrentStep(0);
    setBorrowedPlaces(calculateBorrowedPlaces(newProblem.num1, newProblem.num2));
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  }, [difficulty]);
  
  const calculateBorrowedPlaces = (a: number, b: number) => {
    const borrowedPlaces: number[] = [];
    
    const aStr = a.toString();
    const bStr = b.toString();
    const maxLength = Math.max(aStr.length, bStr.length);
    
    let borrowing = false;
    
    for (let i = 0; i < maxLength; i++) {
      const digitA = parseInt(aStr[aStr.length - 1 - i] || '0', 10);
      const digitB = parseInt(bStr[bStr.length - 1 - i] || '0', 10);
      
      if (digitA < digitB || (digitA === digitB && borrowing)) {
        borrowedPlaces.push(i);
        borrowing = true;
      } else {
        borrowing = false;
      }
    }
    
    return borrowedPlaces;
  };
  
  const handleCustomProblem = () => {
    try {
      if (editableProblem.num1 < editableProblem.num2) {
        toast({
          title: "Invalid subtraction",
          description: "First number must be greater than or equal to second number",
          variant: "destructive",
        });
        return;
      }
      
      const customDifference = editableProblem.num1 - editableProblem.num2;
      const newProblem = {
        num1: editableProblem.num1,
        num2: editableProblem.num2,
        difference: customDifference
      };
      
      setProblem(newProblem);
      setCurrentStep(0);
      setBorrowedPlaces(calculateBorrowedPlaces(newProblem.num1, newProblem.num2));
      setCompleted(false);
      setShowHint(false);
      setIsCustomProblem(true);
      
      toast({
        title: "Custom problem created!",
        description: `${editableProblem.num1} - ${editableProblem.num2} = ${customDifference}`,
      });
    } catch (error) {
      toast({
        title: "Error creating problem",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
    }
  };
  
  const handleEditNum1 = (digit: string, place: number) => {
    const num1Str = editableProblem.num1.toString().padStart(3, '0');
    const newDigits = [...num1Str];
    newDigits[newDigits.length - 1 - place] = digit;
    const newNum1 = parseInt(newDigits.join(''), 10);
    setEditableProblem(prev => ({ ...prev, num1: newNum1 }));
  };
  
  const handleEditNum2 = (digit: string, place: number) => {
    const num2Str = editableProblem.num2.toString().padStart(3, '0');
    const newDigits = [...num2Str];
    newDigits[newDigits.length - 1 - place] = digit;
    const newNum2 = parseInt(newDigits.join(''), 10);
    setEditableProblem(prev => ({ ...prev, num2: newNum2 }));
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };
  
  // Get digit with borrowing visualization
  const getDigitWithBorrowing = (number: number, place: number) => {
    const digit = getDigit(number, place);
    
    if (borrowedPlaces.includes(place) && currentStep >= (place === 0 ? 1 : 3)) {
      return (
        <div className="relative">
          <div className="absolute -top-5 right-0 text-xs text-gray-400 line-through">{digit}</div>
          <div className="text-mathPink font-bold">{digit === 0 ? 10 : digit + 10}</div>
        </div>
      );
    }
    
    if (place > 0 && borrowedPlaces.includes(place - 1) && currentStep >= (place === 1 ? 2 : 4)) {
      return (
        <div className="relative">
          <div className="absolute -top-5 right-0 text-xs text-gray-400 line-through">{digit}</div>
          <div>{digit - 1}</div>
        </div>
      );
    }
    
    return digit;
  };
  
  // Determine steps based on problem
  const steps = [
    {
      instruction: "Let's subtract these numbers digit by digit",
      voice: "Let's subtract these numbers digit by digit, starting from the right side."
    },
    ...(borrowedPlaces.includes(0) ? [
      {
        instruction: "Borrow 1 from the tens place",
        voice: `We need to borrow 1 from the tens place because ${getDigit(problem.num1, 0)} is less than ${getDigit(problem.num2, 0)}.`
      }
    ] : []),
    {
      instruction: "Subtract the ones place",
      voice: `Subtract the ones place: ${borrowedPlaces.includes(0) ? getDigit(problem.num1, 0) + 10 : getDigit(problem.num1, 0)} minus ${getDigit(problem.num2, 0)} equals ${getDigit(problem.difference, 0)}.`
    },
    ...(borrowedPlaces.includes(1) ? [
      {
        instruction: "Borrow 1 from the hundreds place",
        voice: `We need to borrow 1 from the hundreds place because ${getDigit(problem.num1, 1) - (borrowedPlaces.includes(0) ? 1 : 0)} is less than ${getDigit(problem.num2, 1)}.`
      }
    ] : []),
    {
      instruction: "Subtract the tens place",
      voice: `Subtract the tens place: ${borrowedPlaces.includes(1) ? getDigit(problem.num1, 1) + 10 - (borrowedPlaces.includes(0) ? 1 : 0) : getDigit(problem.num1, 1) - (borrowedPlaces.includes(0) ? 1 : 0)} minus ${getDigit(problem.num2, 1)} equals ${getDigit(problem.difference, 1)}.`
    },
    {
      instruction: "Subtract the hundreds place",
      voice: `Subtract the hundreds place: ${getDigit(problem.num1, 2) - (borrowedPlaces.includes(1) ? 1 : 0)} minus ${getDigit(problem.num2, 2)} equals ${getDigit(problem.difference, 2)}.`
    },
    {
      instruction: "Find the final difference",
      voice: `The final difference is ${problem.difference}.`
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
  
  // Display the borrowing arrows
  const renderBorrowArrow = (place: number) => {
    if (borrowedPlaces.includes(place)) {
      const stepToShow = place === 0 ? 1 : 3;
      
      return (
        <StepAnimation step={stepToShow} currentStep={currentStep} delay={300}>
          <div className="absolute -top-6 right-2 text-mathPink font-bold text-sm flex items-center">
            <ArrowDown className="h-4 w-4 mr-1" />1
          </div>
        </StepAnimation>
      );
    }
    return null;
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
          <span className="text-xl font-medium">−</span>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {[2, 1, 0].map((place) => (
            <div key={place} className="relative">
              <NumberBlock 
                value={isCustomProblem ? getDigitWithBorrowing(problem.num1, place) : getDigit(editableProblem.num1, place)} 
                highlighted={
                  (place === 2 && currentStep >= 5) ||
                  (place === 1 && currentStep >= 3 && currentStep < 5) ||
                  (place === 0 && currentStep >= 1 && currentStep < 3)
                }
                editable={!isCustomProblem}
                onChange={(value) => handleEditNum1(value, place)}
              />
              {renderBorrowArrow(place)}
            </div>
          ))}
        </div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {[2, 1, 0].map((place) => (
            <NumberBlock 
              key={place}
              value={isCustomProblem ? getDigit(problem.num2, place) : getDigit(editableProblem.num2, place)} 
              highlighted={
                (place === 2 && currentStep >= 5) ||
                (place === 1 && currentStep >= 4 && currentStep < 5) ||
                (place === 0 && currentStep >= 2 && currentStep < 3)
              }
              editable={!isCustomProblem}
              onChange={(value) => handleEditNum2(value, place)}
            />
          ))}
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          <StepAnimation step={5} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.difference, 2)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
          <StepAnimation step={4} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.difference, 1)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
          <StepAnimation step={2} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.difference, 0)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
      </div>
      
      {!isCustomProblem && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={handleCustomProblem}
            className="bg-mathPink bg-opacity-10 text-mathPink hover:bg-mathPink hover:text-white"
          >
            Create Custom Problem
          </Button>
        </div>
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

export default SubtractionOperation;
