import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Divide, RefreshCw } from "lucide-react";
import LongDivisionSteps from "./LongDivisionSteps";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";
import { playCompleteSound, playPopSound } from "@/utils/divisionSound";

const showFireworks = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

const LongDivisionVisualizer = () => {
  const [dividend, setDividend] = useState<string>("");
  const [divisor, setDivisor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [autoMode, setAutoMode] = useState<boolean>(false);

  const validateInput = () => {
    if (!dividend || !divisor) {
      setError("Please enter both dividend and divisor");
      return false;
    }

    const dividendNum = parseInt(dividend);
    const divisorNum = parseInt(divisor);

    if (isNaN(dividendNum) || isNaN(divisorNum)) {
      setError("Please enter valid numbers");
      return false;
    }

    if (divisorNum === 0) {
      setError("Cannot divide by zero");
      return false;
    }

    if (dividendNum < 0 || divisorNum < 0) {
      setError("Please enter positive numbers");
      return false;
    }

    if (!Number.isInteger(dividendNum) || !Number.isInteger(divisorNum)) {
      setError("Please enter whole numbers");
      return false;
    }

    setError("");
    return true;
  };

  const calculateSteps = () => {
    if (!validateInput()) return;

    const dividendStr = dividend;
    const divisorNum = parseInt(divisor);

    const calculatedSteps = [];
    let currentDividend = "";
    let quotient = "";
    let remainder = 0;
    let position = 0;
    let stepNumber = 0;

    for (let i = 0; i < dividendStr.length; i++) {
      // Bring down the next digit
      currentDividend += dividendStr[i];
      let currentDividendNum = parseInt(currentDividend);

      // If the currentDividend is still less than divisor and we have more digits, continue to next digit
      if (currentDividendNum < divisorNum && i < dividendStr.length - 1) {
        quotient += "0";
        calculatedSteps.push({
          step: stepNumber++,
          type: "bring-down",
          position,
          currentDividend,
          divisor,
          quotientDigit: "0",
          currentQuotient: quotient,
          multiply: 0,
          subtract: currentDividendNum,
          remainingDividend: dividendStr.substring(i + 1),
          description: `${currentDividendNum} is less than ${divisorNum}, so we write 0 in the quotient and bring down the next digit.`,
        });
        position++;
        continue;
      }

      // Calculate the digit for the quotient
      const quotientDigit = Math.floor(currentDividendNum / divisorNum);
      quotient += quotientDigit.toString();

      // Calculate the product and remainder
      const product = quotientDigit * divisorNum;
      remainder = currentDividendNum - product;

      // Add this step to our steps array
      calculatedSteps.push({
        step: stepNumber++,
        type: "divide",
        position,
        currentDividend,
        divisor,
        quotientDigit: quotientDigit.toString(),
        currentQuotient: quotient,
        multiply: product,
        subtract: remainder,
        remainingDividend: dividendStr.substring(i + 1),
        description: `Divide ${currentDividendNum} by ${divisorNum} = ${quotientDigit} with remainder ${remainder}`,
      });

      // Prepare for the next step
      currentDividend = remainder.toString();
      position++;
    }

    // Add final step to show result
    calculatedSteps.push({
      step: stepNumber,
      type: "final",
      quotient,
      remainder: parseInt(currentDividend),
      description: `The quotient is ${quotient} with a remainder of ${currentDividend}`,
    });

    setSteps(calculatedSteps);
    setCurrentStep(0);
    setShowSteps(true);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      playPopSound(); // Play pop sound for each step
      setCurrentStep((prevStep) => prevStep + 1);

      // Show fireworks and play completion sound when reaching the final step
      if (currentStep + 1 === steps.length - 1) {
        showFireworks();
        playCompleteSound();
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      playPopSound(); // Play pop sound when going back
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const resetCalculation = () => {
    setShowSteps(false);
    setCurrentStep(0);
    setSteps([]);
  };

  const startAutoMode = () => {
    if (currentStep < steps.length - 1) {
      setAutoMode(true);
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep >= steps.length - 1) {
            clearInterval(timer);
            setAutoMode(false);
            showFireworks(); // Show fireworks when auto-mode completes
            playCompleteSound(); // Play completion sound
            return steps.length - 1;
          }
          playPopSound(); // Play pop sound for each auto-step
          return nextStep;
        });
      }, 1500);

      return () => clearInterval(timer);
    }
  };

  const exampleProblems = [
    { dividend: "156", divisor: "12" },
    { dividend: "987", divisor: "32" },
    { dividend: "625", divisor: "15" },
  ];

  const loadExample = (example: { dividend: string; divisor: string }) => {
    setDividend(example.dividend);
    setDivisor(example.divisor);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg border-t-4 border-primary">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Long Division Visualizer
      </h2>

      {!showSteps ? (
        <div className="space-y-6">
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Enter Numbers</TabsTrigger>
              <TabsTrigger value="examples">Use Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="dividend"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dividend (Number to be divided)
                  </label>
                  <Input
                    id="dividend"
                    type="text"
                    value={dividend}
                    onChange={(e) =>
                      setDividend(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Enter dividend (e.g., 156)"
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="divisor"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Divisor (Number to divide by)
                  </label>
                  <Input
                    id="divisor"
                    type="text"
                    value={divisor}
                    onChange={(e) =>
                      setDivisor(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Enter divisor (e.g., 12)"
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Select an example problem to visualize:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exampleProblems.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => loadExample(example)}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {example.dividend} ÷ {example.divisor}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={calculateSteps}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Divide className="h-4 w-4" />
            Calculate Division Steps
          </Button>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
            <p className="text-sm text-blue-700">
              This visualizer breaks down long division into easy-to-follow
              steps. Enter a dividend (the number to be divided) and a divisor
              (the number to divide by), then follow along as each step is
              displayed in the traditional long division format.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold">
              {dividend} ÷ {divisor}
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <LongDivisionSteps
            steps={steps.slice(0, currentStep + 1)}
            dividend={dividend}
            divisor={divisor}
          />

          <div className="flex flex-wrap gap-3 justify-between items-center">
            <Button
              onClick={handlePrevStep}
              disabled={currentStep === 0 || autoMode}
              variant="outline"
              className="flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={resetCalculation}
                variant="outline"
                disabled={autoMode}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Restart
              </Button>

              <Button
                onClick={startAutoMode}
                disabled={currentStep === steps.length - 1 || autoMode}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {autoMode ? "Playing..." : "Auto Play"}
              </Button>
            </div>

            <Button
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1 || autoMode}
              className="flex items-center gap-1"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LongDivisionVisualizer;
