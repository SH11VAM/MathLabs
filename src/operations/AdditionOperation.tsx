import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Check, Volume2, VolumeX, Info, Lightbulb, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumberBlock from "../components/NumberBlock";
import StepAnimation from "../components/StepAnimation";
import { generateAdditionProblem } from "../utils/mathProblems";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface AdditionOperationProps {
  onComplete: () => void;
}

const AdditionOperation: React.FC<AdditionOperationProps> = ({
  onComplete,
}) => {
  const { classLevel } = useParams();
  const level = parseInt(classLevel || "1", 10);
  const [activeTab, setActiveTab] = useState("general");

  const [problem, setProblem] = useState({ num1: 0, num2: 0, sum: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [carryValues, setCarryValues] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableProblem, setEditableProblem] = useState({ num1: 0, num2: 0 });
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [userInput, setUserInput] = useState({ num1: "", num2: "" });
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const newProblem = generateAdditionProblem(level);
    setProblem(newProblem);
    setEditableProblem({ num1: newProblem.num1, num2: newProblem.num2 });
    setCurrentStep(0);
    setCarryValues(calculateCarryValues(newProblem.num1, newProblem.num2));
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  }, [level]);

  const marginClass = level === 1 ? "mr-44" : level === 2 ? "mr-24" : "mr-0";
  const marginClass2 = level === 1 ? "justify-self-center" : "justify-self-end";

  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };

  const calculateCarryValues = (a: number, b: number) => {
    const carries: number[] = [];
    let carry = 0;

    const aStr = a.toString();
    const bStr = b.toString();
    const maxLength = Math.max(aStr.length, bStr.length);

    for (let i = 0; i < maxLength; i++) {
      const digitA = parseInt(aStr[aStr.length - 1 - i] || "0", 10);
      const digitB = parseInt(bStr[bStr.length - 1 - i] || "0", 10);
      const sum = digitA + digitB + carry;

      carry = sum >= 10 ? 1 : 0;
      carries.unshift(carry);
    }

    // Only return carries that are 1
    return carries.map((c, i) => (c === 1 ? i : -1)).filter((i) => i !== -1);
  };

  const getMaxDigits = () => {
    const num1 = isCustomProblem ? problem.num1 : editableProblem.num1;
    const num2 = isCustomProblem ? problem.num2 : editableProblem.num2;
    const sum = num1 + num2;

    // For Class 1, always show single digit
    if (level === 1) {
      return 1;
    }

    // For Class 2, show two digits
    if (level === 2) {
      return 2;
    }

    // For Class 3, show three digits
    if (level === 3) {
      return 3;
    }

    // For other classes, show appropriate number of digits
    return Math.max(getDigitCount(num1), getDigitCount(num2), getDigitCount(sum));
  };

  const steps = [
    {
      instruction: "Let's add these numbers digit by digit",
      voice: "Let's add these numbers digit by digit, starting from the right side.",
    },
    {
      instruction: "Add the ones place",
      voice: `Add the ones place: ${getDigit(problem.num1, 0)} plus ${getDigit(problem.num2, 0)} equals ${getDigit(problem.sum, 0)}${carryValues.includes(0) ? " with a carry of 1" : ""}.`,
    },
    ...(carryValues.includes(0)
      ? [
          {
            instruction: "Carry the 1 to the tens place",
            voice: "Carry the 1 to the tens place.",
          },
        ]
      : []),
    {
      instruction: "Add the tens place",
      voice: `Add the tens place: ${getDigit(problem.num1, 1)} plus ${getDigit(problem.num2, 1)} ${carryValues.includes(0) ? "plus the carried 1 " : ""}equals ${getDigit(problem.sum, 1)}${carryValues.includes(1) ? " with a carry of 1" : ""}.`,
    },
    ...(carryValues.includes(1)
      ? [
          {
            instruction: "Carry the 1 to the hundreds place",
            voice: "Carry the 1 to the hundreds place.",
          },
        ]
      : []),
    {
      instruction: "Add the hundreds place",
      voice: `Add the hundreds place: ${getDigit(problem.num1, 2)} plus ${getDigit(problem.num2, 2)} ${carryValues.includes(1) ? "plus the carried 1 " : ""}equals ${getDigit(problem.sum, 2)}.`,
    },
    {
      instruction: "Find the total sum",
      voice: `The total sum is ${problem.sum}.`,
    },
  ];

  const handleCustomProblem = () => {
    try {
      const customSum = editableProblem.num1 + editableProblem.num2;
      const newProblem = {
        num1: editableProblem.num1,
        num2: editableProblem.num2,
        sum: customSum,
      };

      setProblem(newProblem);
      setCurrentStep(0);
      setCarryValues(calculateCarryValues(newProblem.num1, newProblem.num2));
      setCompleted(false);
      setShowHint(false);
      setIsCustomProblem(true);

      toast({
        title: "Custom problem created!",
        description: `${editableProblem.num1} + ${editableProblem.num2} = ${customSum}`,
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
      sum:
        field === "num1"
          ? numValue + editableProblem.num2
          : editableProblem.num1 + numValue,
    };

    setEditableProblem((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    setProblem(newProblem);
    setCarryValues(
      calculateCarryValues(
        field === "num1" ? numValue : editableProblem.num1,
        field === "num2" ? numValue : editableProblem.num2
      )
    );
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prevStep) => prevStep + 1);
      speakInstruction(steps[currentStep].voice);

      if (currentStep === steps.length - 1) {
        setCompleted(true);
        onComplete();
      }
    }
  };

  const speakInstruction = (text: string) => {
    if (isMuted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower
    utterance.pitch = 1.1; // Slightly higher pitch (kid-friendly)
    window.speechSynthesis.speak(utterance);
  };

  // Display the digits of a place value with carrying animation
  const renderCarryDigit = (place: number) => {
    const prevPlaceValue =
      getDigit(problem.num1, place - 1) + getDigit(problem.num2, place - 1);
    const hasCarry = prevPlaceValue >= 10;
    const stepToShow = place === 1 ? 2 : 4;

    if (hasCarry && currentStep >= stepToShow) {
      return (
        <StepAnimation step={stepToShow} currentStep={currentStep} delay={300}>
          <div className="absolute -top-8 right-4 text-mathPink font-bold text-3xl flex items-center ">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span className="bg-white px-1 rounded">1</span>
          </div>
        </StepAnimation>
      );
    }
    return null;
  };

  const getDigitCount = (num: number) => {
    return num.toString().length;
  };

  const getPlaceValues = () => {
    const maxDigits = getMaxDigits();
    return Array.from({ length: maxDigits }, (_, i) => maxDigits - 1 - i);
  };

  const renderGeneralCase = () => (
    <div className="bg-slate-100 rounded-lg p-4 flex flex-col gap-4 justify-center items-center">
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
          {/* Show carry in thousands position */}
          {carryValues.map((place) =>
            place === 2 && currentStep >= 4 ? (
              <StepAnimation
                key={place}
                step={4}
                currentStep={currentStep}
                delay={500}
              >
                <div className="text-mathPink font-bold text-sm flex justify-center items-center h-6">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="bg-white px-1 rounded">1</span>
                </div>
              </StepAnimation>
            ) : null
          )}
        </div>

        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3 ">
          {getPlaceValues().map((place) => (
            <div key={place} className="relative">
              <NumberBlock
                value={getDigit(
                  isCustomProblem ? problem.num1 : editableProblem.num1,
                  place
                )}
                highlighted={
                  (place === 3 &&
                    currentStep >= 4 &&
                    carryValues.includes(2)) ||
                  (place === 2 &&
                    currentStep >= 4 &&
                    carryValues.includes(1)) ||
                  (place === 1 && currentStep >= 3 && currentStep < 4) ||
                  (place === 0 && currentStep >= 1 && currentStep < 3)
                }
                editable={!isCustomProblem}
                onChange={(value) => handleUserInput(value, "num1")}
              />
              {place > 0 && renderCarryDigit(place)}
            </div>
          ))}
        </div>

        <div className="col-span-1 flex justify-end items-center">
          <span className="text-6xl font-medium">+</span>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-3">
          {getPlaceValues().map((place) => (
            <NumberBlock
              key={place}
              value={getDigit(
                isCustomProblem ? problem.num2 : editableProblem.num2,
                place
              )}
              highlighted={
                (place === 3 && currentStep >= 4 && carryValues.includes(2)) ||
                (place === 2 && currentStep >= 4 && carryValues.includes(1)) ||
                (place === 1 && currentStep >= 3 && currentStep < 4) ||
                (place === 0 && currentStep >= 1 && currentStep < 3)
              }
              editable={!isCustomProblem}
              onChange={(value) => handleUserInput(value, "num2")}
            />
          ))}
        </div>

        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>

        <div className="col-span-1"></div>
        <div className={`col-span-3 flex ${marginClass2} ${marginClass} gap-2 `}>
          {getPlaceValues().map((place) => (
            <StepAnimation
              key={place}
              step={place === 0 ? 1 : place === 1 ? 3 : 4}
              currentStep={currentStep}
            >
              <NumberBlock
                value={getDigit(problem.sum, place)}
                color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
              />
            </StepAnimation>
          ))}
        </div>
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

      <div className="flex flex-col gap-4 items-center">
        {completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
            <Button variant="outline" onClick={() => setShowHint(!showHint)}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            <Button onClick={handleNextStep}>Next Step</Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVisualize = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Visual Addition</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Number 1: {problem.num1}</p>
            <div className="flex gap-2">
              {getPlaceValues().map((place) => (
                <div key={place} className="relative">
                  <NumberBlock
                    value={getDigit(problem.num1, place)}
                    highlighted={true}
                  />
                  {renderCarryDigit(place)}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Number 2: {problem.num2}</p>
            <div className="flex gap-2">
              {getPlaceValues().map((place) => (
                <NumberBlock
                  key={place}
                  value={getDigit(problem.num2, place)}
                  highlighted={true}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">Sum: {problem.sum}</p>
          <div className="flex gap-2">
            {getPlaceValues().map((place) => (
              <NumberBlock
                key={place}
                value={getDigit(problem.sum, place)}
                color="bg-mathGreen bg-opacity-20"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTipsAndTricks = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Addition Tips & Tricks</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Break Down Numbers</h4>
            <p className="text-sm text-muted-foreground">
              Break down large numbers into smaller, more manageable parts. For example:
              <br />
              123 + 456 = (100 + 400) + (20 + 50) + (3 + 6) = 500 + 70 + 9 = 579
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Use Number Bonds</h4>
            <p className="text-sm text-muted-foreground">
              Use number bonds to make 10 or 100. For example:
              <br />
              7 + 8 = (7 + 3) + 5 = 10 + 5 = 15
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Compensation Method</h4>
            <p className="text-sm text-muted-foreground">
              Adjust one number to make it easier to add, then compensate:
              <br />
              98 + 45 = (100 + 45) - 2 = 145 - 2 = 143
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-end w-full mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="hover:bg-gray-100"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mb-8 text-center">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">
          {currentStep < steps.length
            ? steps[currentStep].instruction
            : steps[steps.length - 1].instruction}
        </h3>
        {showHint && (
          <p className="text-sm text-muted-foreground">
            {steps[currentStep]?.voice}
          </p>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full max-w-3xl" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            General Case
          </TabsTrigger>
          <TabsTrigger value="visualize" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualize
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Tips & Tricks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          {renderGeneralCase()}
        </TabsContent>
        <TabsContent value="visualize">
          {renderVisualize()}
        </TabsContent>
        <TabsContent value="tips">
          {renderTipsAndTricks()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdditionOperation;
