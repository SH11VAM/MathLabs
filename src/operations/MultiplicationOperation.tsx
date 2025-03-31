import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NumberBlock from '../components/NumberBlock';
import StepAnimation from '../components/StepAnimation';
import { generateMultiplicationProblem } from '../utils/mathProblems';
import { toast } from "@/hooks/use-toast";

interface MultiplicationOperationProps {
  onComplete: () => void;
}

const MultiplicationOperation: React.FC<MultiplicationOperationProps> = ({ onComplete }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, product: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [partialProducts, setPartialProducts] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableProblem, setEditableProblem] = useState({ num1: 0, num2: 0 });
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [userInput, setUserInput] = useState({ num1: "", num2: "" });
  const [carries, setCarries] = useState<number[][]>([]);
  
  useEffect(() => {
    const newProblem = generateMultiplicationProblem("1");
    setProblem(newProblem);
    setEditableProblem({ num1: newProblem.num1, num2: newProblem.num2 });
    setCurrentStep(0);
    const { products, carries: newCarries } = calculatePartialProducts(newProblem.num1, newProblem.num2);
    setPartialProducts(products);
    setCarries(newCarries);
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  }, []);
  
  const calculatePartialProducts = (a: number, b: number) => {
    const products: number[] = [];
    const carries: number[][] = [];
    const bStr = b.toString();
    
    for (let i = 0; i < bStr.length; i++) {
      const digit = parseInt(bStr[bStr.length - 1 - i], 10);
      const product = a * digit;
      const productStr = product.toString();
      const productDigits = productStr.split('').map(Number);
      const carryRow = new Array(3).fill(0);
      
      // Calculate carries for each digit
      for (let j = 0; j < productDigits.length; j++) {
        if (j < productDigits.length - 1) {
          carryRow[j] = Math.floor(productDigits[j] / 10);
          productDigits[j] = productDigits[j] % 10;
        }
      }
      
      products.push(product);
      carries.push(carryRow);
    }
    
    return { products, carries };
  };

  const handleCustomProblem = () => {
    try {
      const customProduct = editableProblem.num1 * editableProblem.num2;
      const newProblem = {
        num1: editableProblem.num1,
        num2: editableProblem.num2,
        product: customProduct,
      };

      setProblem(newProblem);
      setCurrentStep(0);
      const { products, carries: newCarries } = calculatePartialProducts(newProblem.num1, newProblem.num2);
      setPartialProducts(products);
      setCarries(newCarries);
      setCompleted(false);
      setShowHint(false);
      setIsCustomProblem(true);

      toast({
        title: "Custom problem created!",
        description: `${editableProblem.num1} × ${editableProblem.num2} = ${customProduct}`,
      });
    } catch (error) {
      toast({
        title: "Error creating problem",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
    }
  };

  const handleUserInput = (value: string, field: "num1" | "num2") => {
    const numValue = parseInt(value) || 0;
    setUserInput((prev) => ({ ...prev, [field]: value }));

    if (value === "" || isNaN(numValue)) {
      return;
    }

    const newProblem = {
      num1: field === "num1" ? numValue : editableProblem.num1,
      num2: field === "num2" ? numValue : editableProblem.num2,
      product: field === "num1" ? numValue * editableProblem.num2 : editableProblem.num1 * numValue,
    };

    setEditableProblem((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    setProblem(newProblem);
    const { products, carries: newCarries } = calculatePartialProducts(
      field === "num1" ? numValue : editableProblem.num1,
      field === "num2" ? numValue : editableProblem.num2
    );
    setPartialProducts(products);
    setCarries(newCarries);
  };
  
  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };

  const getDigitCount = (num: number) => {
    return num.toString().length;
  };

  const getMaxDigits = () => {
    const num1 = isCustomProblem ? problem.num1 : editableProblem.num1;
    const num2 = isCustomProblem ? problem.num2 : editableProblem.num2;
    const product = num1 * num2;

    // If both numbers are single digits but their product is two digits
    if (
      getDigitCount(num1) === 1 &&
      getDigitCount(num2) === 1 &&
      getDigitCount(product) === 2
    ) {
      return 2; // Show two digits for the product
    }

    // If both numbers are two digits but their product is three digits
    if (
      getDigitCount(num1) === 2 &&
      getDigitCount(num2) === 2 &&
      getDigitCount(product) === 3
    ) {
      return 3; // Show three digits for the product
    }

    return Math.max(getDigitCount(num1), getDigitCount(num2));
  };

  const getPlaceValues = () => {
    const maxDigits = getMaxDigits();
    return Array.from({ length: maxDigits }, (_, i) => maxDigits - 1 - i);
  };
  
  // Determine steps based on problem
  const steps = [
    {
      instruction: "Let's multiply these numbers step by step",
      voice: `Let's multiply ${problem.num1} by ${problem.num2} step by step.`
    },
    ...partialProducts.map((product, index) => ({
      instruction: `Multiply by ${getDigit(problem.num2, index)}`,
      voice: `Multiply ${problem.num1} by ${getDigit(problem.num2, index)} to get ${product}.`
    })),
    {
      instruction: "Add all partial products",
      voice: `Add all the partial products to get the final result: ${problem.product}.`
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

      <div className="mb-6 grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            First Number
          </label>
          <input
            type="number"
            value={userInput.num1}
            onChange={(e) => handleUserInput(e.target.value, "num1")}
            className="border rounded-md px-3 py-2 text-center text-lg"
            placeholder="Enter first number"
            min="0"
            max="999"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Second Number
          </label>
          <input
            type="number"
            value={userInput.num2}
            onChange={(e) => handleUserInput(e.target.value, "num2")}
            className="border rounded-md px-3 py-2 text-center text-lg"
            placeholder="Enter second number"
            min="0"
            max="999"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {getPlaceValues().map((place) => (
            <NumberBlock 
              key={place}
              value={getDigit(isCustomProblem ? problem.num1 : editableProblem.num1, place)} 
              highlighted={currentStep > 0}
              editable={!isCustomProblem}
              onChange={(value) => handleUserInput(value, "num1")}
            />
          ))}
        </div>
        
        <div className="col-span-1 flex justify-end items-center">
          <span className="text-6xl font-medium">×</span>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-3">
          {getPlaceValues().map((place) => (
            <NumberBlock 
              key={place}
              value={getDigit(isCustomProblem ? problem.num2 : editableProblem.num2, place)} 
              highlighted={currentStep > 0}
              editable={!isCustomProblem}
              onChange={(value) => handleUserInput(value, "num2")}
            />
          ))}
        </div>
        
        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>
        
        {/* Show partial products with carries */}
        {partialProducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="col-span-1"></div>
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <StepAnimation step={index + 1} currentStep={currentStep}>
                {/* Carries row */}
                <div className="col-span-3 grid grid-cols-3 gap-3 mb-1">
                  {carries[index].map((carry, carryIndex) => (
                    <div key={carryIndex} className="relative">
                      {carry > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="bg-mathPink text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            {carry}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Product digits */}
                <NumberBlock 
                  value={getDigit(product, 2)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(product, 1)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
                <NumberBlock 
                  value={getDigit(product, 0)} 
                  color={currentStep > index ? "bg-mathPurple bg-opacity-20" : "bg-white"}
                />
              </StepAnimation>
            </div>
          </React.Fragment>
        ))}
        
        {/* Final product */}
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-4 gap-3">
          <StepAnimation step={steps.length - 1} currentStep={currentStep}>
            <NumberBlock 
              value={getDigit(problem.product, 3)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.product, 2)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.product, 1)} 
              color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
            />
            <NumberBlock 
              value={getDigit(problem.product, 0)} 
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

export default MultiplicationOperation;
