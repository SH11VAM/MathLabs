import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  PlayCircle, 
  PauseCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { MultiplicationState, CalculationStep } from '@/types/multiplication';
import { useToast } from '@/hooks/use-toast';
import DigitGrid from './DigitGrid';
import confetti from 'canvas-confetti';
import { playPopSound, playCompleteSound } from '@/utils/sound';

const showFireworks = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

const MultiplicationVisualizer: React.FC = () => {
  const [firstInput, setFirstInput] = useState<string>('24');
  const [secondInput, setSecondInput] = useState<string>('35');
  const [state, setState] = useState<MultiplicationState>({
    multiplicand: 0,
    multiplier: 0,
    steps: [],
    currentStep: 0,
    isComplete: false
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle input changes
  const handleFirstInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFirstInput(value);
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSecondInput(value);
  };

  // Process multiplication
  const processMultiplication = () => {
    if (!firstInput || !secondInput) {
      toast({
        title: "Missing input",
        description: "Please enter both numbers to multiply",
        variant: "destructive"
      });
      return;
    }

    const multiplicand = parseInt(firstInput, 10);
    const multiplier = parseInt(secondInput, 10);

    if (isNaN(multiplicand) || isNaN(multiplier)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numbers",
        variant: "destructive"
      });
      return;
    }

    // Generate all the calculation steps
    const steps = generateCalculationSteps(multiplicand, multiplier);

    setState({
      multiplicand,
      multiplier,
      steps,
      currentStep: 0,
      isComplete: false
    });

    toast({
      title: "Calculation ready",
      description: `${multiplicand} × ${multiplier} = ${multiplicand * multiplier}`,
    });
  };

  // Generate all calculation steps for the visualization
  const generateCalculationSteps = (multiplicand: number, multiplier: number): CalculationStep[] => {
    const steps: CalculationStep[] = [];
    const multiplicandDigits = multiplicand.toString().split('').map(Number);
    const multiplierDigits = multiplier.toString().split('').map(Number);
    
    // Initial step - setup the multiplication
    steps.push({
      type: 'multiply',
      description: `Let's multiply ${multiplicand} by ${multiplier} step by step.`,
      highlightPositions: {
        multiplicand: multiplicandDigits.map((_, i) => i),
        multiplier: multiplierDigits.map((_, i) => i)
      },
      addedValues: []
    });

    // For each digit in the multiplier (working right to left)
    const partialProducts: number[][] = [];
    
    for (let i = multiplierDigits.length - 1; i >= 0; i--) {
      const currentMultiplierDigit = multiplierDigits[i];
      const placeValue = multiplierDigits.length - 1 - i;
      const digitDescription = `Now we'll multiply each digit of ${multiplicand} by ${currentMultiplierDigit} (the ${getOrdinal(multiplierDigits.length - i)} digit of ${multiplier} from the right).`;
      
      steps.push({
        type: 'multiply',
        description: digitDescription,
        highlightPositions: {
          multiplicand: multiplicandDigits.map((_, idx) => idx),
          multiplier: [i]
        },
        addedValues: []
      });

      let carry = 0;
      const currentPartialProduct: number[] = Array(placeValue).fill("X"); // Add zeros for place value
      const carryValues: { [key: number]: number } = {};

      // For each digit in the multiplicand (working right to left)
      for (let j = multiplicandDigits.length - 1; j >= 0; j--) {
        const currentMultiplicandDigit = multiplicandDigits[j];
        const product = currentMultiplicandDigit * currentMultiplierDigit + carry;
        const productDigit = product % 10;
        carry = Math.floor(product / 10);
        
        // First show just the product digit
        steps.push({
          type: 'multiply',
          description: `Multiply ${currentMultiplicandDigit} × ${currentMultiplierDigit} = ${product}.`,
          highlightPositions: {
            multiplicand: [j],
            multiplier: [i],
            product: currentPartialProduct.length - 1 >= 0 ? [currentPartialProduct.length - 1] : []
          },
          currentColumnIndex: j,
          partialProducts: [...partialProducts, [ productDigit,...currentPartialProduct]],
          addedValues: [productDigit]
        });

        // If there's a carry, show it
        if (carry > 0) {
          carryValues[j - 1] = carry;
          steps.push({
            type: 'carry',
            description: `The product ${product} has two digits. We write ${productDigit} and carry the ${carry} to the next column.`,
            highlightPositions: {
              multiplicand: [j - 1 >= 0 ? j - 1 : null],
              carry: [j - 1 >= 0 ? j - 1 : null]
            },
            carryValues: { ...carryValues },
            partialProducts: [...partialProducts, [ productDigit, ...currentPartialProduct]],
            addedValues: [carry]
          });
        }

        // Add the current digit to our partial product (pushing to the left)
        currentPartialProduct.unshift(productDigit);
      }

      // If there's a final carry, add it to the partial product (pushing to the left)
      if (carry > 0) {
        currentPartialProduct.unshift(carry);
        steps.push({
          type: 'carry',
          description: `We add the final carry ${carry} as the leftmost digit of our partial product.`,
          highlightPositions: {
            product: [0]
          },
          partialProducts: [...partialProducts, [...currentPartialProduct]],
          addedValues: [carry]
        });
      }

      // Add the complete partial product
      partialProducts.push([...currentPartialProduct]);
      
      steps.push({
        type: 'partialProduct',
        description: `We've completed multiplying ${multiplicand} by ${currentMultiplierDigit}, giving us the partial product ${currentPartialProduct.join('')}.`,
        partialProducts: [...partialProducts],
        currentPartialProductIndex: partialProducts.length - 1,
        addedValues: currentPartialProduct
      });
    }

    // Add the final summation step
    const finalProduct = (multiplicand * multiplier).toString().split('').map(Number);
    
    
    steps.push({
      type: 'finalSum',
      description: `Finally, we add all the partial products to get the answer: ${multiplicand} × ${multiplier} = ${multiplicand * multiplier}.`,
      partialProducts: [...partialProducts],
      finalProduct: finalProduct,
      addedValues: finalProduct
    });

    return steps;
  };

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Navigation functions
  const nextStep = () => {
    if (state.currentStep < state.steps.length - 1) {
      playPopSound();
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        isComplete: prev.currentStep + 1 === prev.steps.length - 1
      }));

      // If this is the last step, play complete sound and show fireworks
      if (state.currentStep + 1 === state.steps.length - 1) {
        playCompleteSound();
        showFireworks();
      }
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      playPopSound();
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        isComplete: false
      }));
    }
  };

  const resetVisualization = () => {
    setState(prev => ({
      ...prev,
      currentStep: 0,
      isComplete: false
    }));
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Effect for auto-play functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAutoPlaying && state.currentStep < state.steps.length - 1) {
      timer = setTimeout(() => {
        nextStep();
      }, 1500); // Auto-advance every 1.5 seconds
    } else if (isAutoPlaying && state.currentStep >= state.steps.length - 1) {
      // Stop auto-play when reaching the end
      setIsAutoPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoPlaying, state.currentStep, state.steps.length]);

  // Current step for rendering
  const currentStep = state.steps[state.currentStep] || {
    type: 'multiply',
    description: 'Enter two numbers to start.',
    addedValues: []
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-mathBlue mb-6">Step-by-Step Multiplication</h1>
      
      {/* Input section */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 ">
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="firstNumber" className="text-sm font-medium mb-1">First Number</label>
          <Input
            id="firstNumber"
            type="text"
            value={firstInput}
            onChange={handleFirstInputChange}
            className="text-center text-xl"
            maxLength={4}
            placeholder="Enter a number"
          />
        </div>
        
        <div className="text-4xl font-bold text-mathBlue -mb-4">×</div>
        
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="secondNumber" className="text-sm font-medium mb-1">Second Number</label>
          <Input
            id="secondNumber"
            type="text"
            value={secondInput}
            onChange={handleSecondInputChange}
            className="text-center text-xl"
            maxLength={4}
            placeholder="Enter a number"
          />
        </div>
        
        <Button 
          onClick={processMultiplication}
          className="bg-mathBlue hover:bg-mathLightBlue -mb-5 sm:mt-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Calculate
        </Button>
      </div>
      
      {/* Visualization area */}
      {state.steps.length > 0 && (
        <div className="w-full bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="bg-mathRed rounded p-3 mb-4">
            <p className="text-lg ">{currentStep.description}</p>
          </div>
          
          <DigitGrid 
            state={state}
            currentStep={currentStep}
          />
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={resetVisualization}
              disabled={state.currentStep === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={state.currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleAutoPlay}
              >
                {isAutoPlaying ? (
                  <>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Auto-Play
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={nextStep}
                disabled={state.currentStep === state.steps.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {state.isComplete && (
              <Button className="bg-mathGreen hover:bg-mathGreen/90">
                <Check className="h-4 w-4 mr-2" />
                Complete!
              </Button>
            )}
            
            {!state.isComplete && <div className="w-[100px]"></div>}
          </div>
        </div>
      )}
      
      {/* Explanation of traditional multiplication */}
      
    </div>
  );
};

export default MultiplicationVisualizer;