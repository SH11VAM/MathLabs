import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { toast } from "@/hooks/use-toast";

interface CountingOperationProps {
  onComplete: () => void;
}

const CountingOperation: React.FC<CountingOperationProps> = ({ onComplete }) => {
  const [targetNumber, setTargetNumber] = useState(10); // Default to counting to 10
  const [currentNumber, setCurrentNumber] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableNumber, setEditableNumber] = useState(10);
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  
  useEffect(() => {
    generateCountingProblem(10);
  }, []);
  
  const generateCountingProblem = (n: number) => {
    if (n < 1 || n > 100) {
      toast({
        title: "Invalid number",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
      });
      return;
    }
    
    setTargetNumber(n);
    setEditableNumber(n);
    setCurrentNumber(0);
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  };
  
  const handleCustomProblem = () => {
    generateCountingProblem(editableNumber);
  };
  
  const handleEditNumber = (value: string) => {
    const newNumber = parseInt(value);
    if (!isNaN(newNumber)) {
      setEditableNumber(newNumber);
    }
  };
  
  const handleNextNumber = () => {
    if (currentNumber < targetNumber) {
      setCurrentNumber(prev => prev + 1);
      speakInstruction(`Count to ${currentNumber + 1}`);
      
      if (currentNumber + 1 === targetNumber) {
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
          onClick={() => speakInstruction(`Count to ${currentNumber + 1}`)}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-8 text-center">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">
          Count from 1 to {targetNumber}
        </h3>
        {showHint && (
          <p className="text-sm text-muted-foreground">
            Click the Next Number button to count up
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="col-span-1 flex justify-end items-center">
          <span className="text-xl font-medium">Count to:</span>
        </div>
        <div className="col-span-3">
          <NumberBlock 
            value={isCustomProblem ? targetNumber : editableNumber} 
            highlighted={currentNumber > 0}
            editable={!isCustomProblem}
            onChange={handleEditNumber}
          />
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        <div className="col-span-1"></div>
        <div className="col-span-3">
          <StepAnimation step={currentNumber} currentStep={currentNumber}>
            <NumberBlock 
              value={currentNumber} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
          </StepAnimation>
        </div>
      </div>
      
      {/* Show counting sequence */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {Array.from({ length: targetNumber }, (_, i) => (
          <StepAnimation key={i} step={i + 1} currentStep={currentNumber}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i < currentNumber ? "bg-mathPurple bg-opacity-20" : "bg-white"
            }`}>
              {i + 1}
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
            <Button onClick={handleNextNumber}>
              Next Number
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountingOperation; 