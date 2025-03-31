import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { toast } from "@/hooks/use-toast";

interface NumbersOperationProps {
  onComplete: () => void;
}

const NumbersOperation: React.FC<NumbersOperationProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'greater' | 'less' | 'equal' | null>(null);
  const [numbers, setNumbers] = useState<{ num1: number; num2: number }>({ num1: 0, num2: 0 });
  
  useEffect(() => {
    generateNumbers();
  }, []);
  
  const generateNumbers = () => {
    // Generate two numbers between 1 and 99
    const num1 = Math.floor(Math.random() * 99) + 1;
    const num2 = Math.floor(Math.random() * 99) + 1;
    setNumbers({ num1, num2 });
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };
  
  const handleAnswer = (answer: 'greater' | 'less' | 'equal') => {
    setSelectedAnswer(answer);
    const correctAnswer = numbers.num1 > numbers.num2 ? 'greater' : 
                         numbers.num1 < numbers.num2 ? 'less' : 'equal';
    
    if (answer === correctAnswer) {
      setCompleted(true);
      onComplete();
      speakInstruction(`Correct! ${numbers.num1} ${getSymbol(correctAnswer)} ${numbers.num2}`);
    } else {
      toast({
        title: "Try again!",
        description: "Think about the place values of each digit",
        variant: "destructive",
      });
    }
  };
  
  const getSymbol = (answer: 'greater' | 'less' | 'equal' | null) => {
    switch (answer) {
      case 'greater':
        return '>';
      case 'less':
        return '<';
      case 'equal':
        return '=';
      default:
        return '';
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
  
  const steps = [
    {
      instruction: "Let's compare these numbers",
      voice: `Let's compare ${numbers.num1} and ${numbers.num2}. Look at each digit's place value.`
    },
    {
      instruction: "Compare the tens place",
      voice: `First, look at the tens place. ${getDigit(numbers.num1, 1)} tens and ${getDigit(numbers.num2, 1)} tens.`
    },
    {
      instruction: "Compare the ones place",
      voice: `Now, look at the ones place. ${getDigit(numbers.num1, 0)} ones and ${getDigit(numbers.num2, 0)} ones.`
    },
    {
      instruction: "Which symbol should we use?",
      voice: `Which symbol should we use to compare ${numbers.num1} and ${numbers.num2}?`
    }
  ];
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-end w-full mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => speakInstruction(steps[currentStep].voice)}
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-8 text-center">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">
          {steps[currentStep].instruction}
        </h3>
        {showHint && (
          <p className="text-sm text-muted-foreground">
            {steps[currentStep].voice}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-5 gap-3 mb-8">
        <div className="col-span-1 flex justify-end items-center">
          <span className="text-xl font-medium">Compare:</span>
        </div>
        <div className="col-span-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">First Number</div>
            <div className="grid grid-cols-2 gap-2">
              <NumberBlock 
                value={getDigit(numbers.num1, 1)} 
                highlighted={currentStep >= 1}
              />
              <NumberBlock 
                value={getDigit(numbers.num1, 0)} 
                highlighted={currentStep >= 2}
              />
            </div>
            <div className="text-lg font-bold mt-2">{numbers.num1}</div>
          </div>
          
          <div className="flex items-center justify-center">
            {currentStep >= 3 && !completed ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAnswer('greater')}
                  className={`text-2xl font-bold ${
                    selectedAnswer === 'greater' 
                      ? 'bg-mathGreen bg-opacity-20 text-mathGreen' 
                      : ''
                  }`}
                >
                  &gt;
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAnswer('less')}
                  className={`text-2xl font-bold ${
                    selectedAnswer === 'less' 
                      ? 'bg-mathGreen bg-opacity-20 text-mathGreen' 
                      : ''
                  }`}
                >
                  &lt;
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAnswer('equal')}
                  className={`text-2xl font-bold ${
                    selectedAnswer === 'equal' 
                      ? 'bg-mathGreen bg-opacity-20 text-mathGreen' 
                      : ''
                  }`}
                >
                  =
                </Button>
              </div>
            ) : (
              <div className="text-3xl font-bold w-8 h-8 flex items-center justify-center">
                {getSymbol(selectedAnswer)}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Second Number</div>
            <div className="grid grid-cols-2 gap-2">
              <NumberBlock 
                value={getDigit(numbers.num2, 1)} 
                highlighted={currentStep >= 1}
              />
              <NumberBlock 
                value={getDigit(numbers.num2, 0)} 
                highlighted={currentStep >= 2}
              />
            </div>
            <div className="text-lg font-bold mt-2">{numbers.num2}</div>
          </div>
        </div>
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
            <Button 
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
            >
              Next Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumbersOperation; 