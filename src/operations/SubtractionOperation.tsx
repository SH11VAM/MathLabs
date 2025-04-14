import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  Volume2,
  VolumeX,
  Info,
  Lightbulb,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NumberBlock from "../components/NumberBlock";
import StepAnimation from "../components/StepAnimation";
import { generateSubtractionProblem } from "../utils/mathProblems";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import VisualSubtract from "@/components/VisualSubtract";

interface SubtractionOperationProps {
  onComplete: () => void;
}

const SubtractionOperation: React.FC<SubtractionOperationProps> = ({
  onComplete,
}) => {
  const { classLevel } = useParams();
  const level = parseInt(classLevel || "1", 10);

  const [problem, setProblem] = useState({ num1: 0, num2: 0, difference: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [borrowedPlaces, setBorrowedPlaces] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [editableProblem, setEditableProblem] = useState({ num1: 0, num2: 0 });
  const [isCustomProblem, setIsCustomProblem] = useState(false);
  const [userInput, setUserInput] = useState({ num1: "", num2: "" });
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [checkVoice, setCheckVoice] = useState("");

  useEffect(() => {
    const newProblem = generateSubtractionProblem(level);
    setProblem(newProblem);
    setEditableProblem({ num1: newProblem.num1, num2: newProblem.num2 });
    setCurrentStep(0);
    setBorrowedPlaces(
      calculateBorrowedPlaces(newProblem.num1, newProblem.num2)
    );
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  }, [level]);

  const marginClass =
    level === 1 ? "lg:mr-44 mr-24" : level === 2 ? "lg:mr-24 mr-10 " : "mr-0";
  const marginClass2 = level === 1 ? "justify-self-center" : "justify-self-end";

  const calculateBorrowedPlaces = (a: number, b: number) => {
    const borrowedPlaces: number[] = [];
    const maxDigits = Math.max(getDigitCount(a), getDigitCount(b));
    const aStr = a.toString().padStart(maxDigits, "0");
    const bStr = b.toString().padStart(maxDigits, "0");

    let borrowing = false;

    for (let i = 0; i < maxDigits; i++) {
      const digitA = parseInt(aStr[maxDigits - 1 - i], 10);
      const digitB = parseInt(bStr[maxDigits - 1 - i], 10);

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
      const maxNumber = getMaxNumber();
      const customDifference = editableProblem.num1 - editableProblem.num2;

      // Check if either number exceeds the maximum allowed
      if (
        editableProblem.num1 > maxNumber ||
        editableProblem.num2 > maxNumber
      ) {
        toast({
          title: "Invalid Problem",
          description: `For ${getClassHeading()}, numbers cannot exceed ${maxNumber}`,
          variant: "destructive",
        });
        return;
      }

      // Check if the difference would be negative
      if (customDifference < 0) {
        toast({
          title: "Invalid Problem",
          description:
            "The first number must be greater than or equal to the second number",
          variant: "destructive",
        });
        return;
      }

      const newProblem = {
        num1: editableProblem.num1,
        num2: editableProblem.num2,
        difference: customDifference,
      };

      setProblem(newProblem);
      setCurrentStep(0);
      setBorrowedPlaces(
        calculateBorrowedPlaces(newProblem.num1, newProblem.num2)
      );
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

  const handleUserInput = (value: string, field: "num1" | "num2") => {
    const numValue = parseInt(value) || 0;
    setUserInput((prev) => ({ ...prev, [field]: value }));
    if (value === "" || isNaN(numValue)) {
      return;
    }
    const maxNumber = getMaxNumber();
    const otherNum =
      field === "num1" ? editableProblem.num2 : editableProblem.num1;
    const potentialDifference =
      field === "num1" ? numValue - otherNum : otherNum - numValue;

    // Check if the input number exceeds the maximum allowed for the class level
    if (numValue > maxNumber) {
      toast({
        title: "Invalid Input",
        description: `For ${getClassHeading()}, numbers cannot exceed ${maxNumber}`,
        variant: "destructive",
      });
      return;
    }

    // Check if the difference would be negative
    if (potentialDifference < 0) {
      toast({
        title: "Invalid Input",
        description:
          "The first number must be greater than or equal to the second number",
        variant: "destructive",
      });
      return;
    }

    const newProblem = {
      num1: field === "num1" ? numValue : editableProblem.num1,
      num2: field === "num2" ? numValue : editableProblem.num2,
      difference: potentialDifference,
    };

    setEditableProblem((prev) => ({
      ...prev,
      [field]: numValue,
    }));
    setProblem(newProblem);
    setBorrowedPlaces(
      calculateBorrowedPlaces(
        field === "num1" ? numValue : editableProblem.num1,
        field === "num2" ? numValue : editableProblem.num2
      )
    );
  };

  const getDigit = (number: number, place: number) => {
    return Math.floor((number / Math.pow(10, place)) % 10);
  };

  // Get digit with borrowing visualization
  const getDigitWithBorrowing = (number: number, place: number) => {
    const digit = getDigit(number, place);

    if (
      borrowedPlaces.includes(place) &&
      currentStep >= (place === 0 ? 1 : 3)
    ) {
      return digit === 0 ? 10 : digit + 10;
    }

    if (
      place > 0 &&
      borrowedPlaces.includes(place - 1) &&
      currentStep >= (place === 1 ? 2 : 4)
    ) {
      return digit - 1;
    }

    return digit;
  };

  const renderBorrowVisualization = (place: number) => {
    const digit = getDigit(problem.num1, place);

    if (
      borrowedPlaces.includes(place) &&
      currentStep >= (place === 0 ? 1 : 3)
    ) {
      return (
        <div className="absolute -top-10 ml-6 right-0 lg:text-2xl text-lg text-mathGreen line-through">
          {digit}
        </div>
      );
    }

    if (
      place > 0 &&
      borrowedPlaces.includes(place - 1) &&
      currentStep >= (place === 1 ? 2 : 4)
    ) {
      return (
        <div className="absolute -top-10 right-5 lg:text-2xl text-lg text-mathGreen line-through">
          {digit}
        </div>
      );
    }

    return null;
  };

  const getDigitCount = (num: number) => {
    return num.toString().length;
  };

  const getMaxDigits = () => {
    const num1 = isCustomProblem ? problem.num1 : editableProblem.num1;
    const num2 = isCustomProblem ? problem.num2 : editableProblem.num2;
    const difference = num1 - num2;

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
    return Math.max(getDigitCount(num1), getDigitCount(num2));
  };

  const getPlaceValues = () => {
    const maxDigits = getMaxDigits();
    return Array.from({ length: maxDigits }, (_, i) => maxDigits - 1 - i);
  };

  const getMaxNumber = () => {
    switch (level) {
      case 1:
        return 9; // One digit numbers (0-9)
      case 2:
        return 99; // Two digit numbers (0-99)
      case 3:
        return 499; // Three digit numbers (0-499)
      default:
        return 499;
    }
  };

  const getClassHeading = () => {
    switch (level) {
      case 1:
        return "One-Digit Subtraction";
      case 2:
        return "Two-Digit Subtraction";
      case 3:
        return "Three-Digit Subtraction";
      default:
        return "Subtraction";
    }
  };

  // Determine steps based on problem
  const steps = [
    {
      instruction:
        level === 1
          ? "Let's subtract these numbers"
          : "Let's subtract these numbers digit by digit",
      voice: `Subtract ${problem.num1} minus ${problem.num2} equals ${problem.difference}.`,
    },
    ...(level === 1
      ? [
          {
            instruction: "Subtract the numbers",
            voice: `Great job! Click on Next Question`,
          },
        ]
      : [
          ...(borrowedPlaces.includes(0)
            ? [
                {
                  instruction: "Borrow 1 from the tens place",
                  voice: `We need to borrow 1 from the tens place because ${getDigit(
                    problem.num1,
                    0
                  )} is less than ${getDigit(problem.num2, 0)}.`,
                },
              ]
            : []),
          {
            instruction: "Subtract the ones place",
            voice: `Subtract the ones place: ${
              borrowedPlaces.includes(0)
                ? getDigit(problem.num1, 0) + 10
                : getDigit(problem.num1, 0)
            } minus ${getDigit(problem.num2, 0)} equals ${getDigit(
              problem.difference,
              0
            )}.`,
          },
          ...(borrowedPlaces.includes(1)
            ? [
                {
                  instruction: "Borrow 1 from the hundreds place",
                  voice: `We need to borrow 1 from the hundreds place because ${
                    getDigit(problem.num1, 1) -
                    (borrowedPlaces.includes(0) ? 1 : 0)
                  } is less than ${getDigit(problem.num2, 1)}.`,
                },
              ]
            : []),
          {
            instruction: "Subtract the tens place",
            voice: `Subtract the tens place: ${
              borrowedPlaces.includes(1)
                ? getDigit(problem.num1, 1) +
                  10 -
                  (borrowedPlaces.includes(0) ? 1 : 0)
                : getDigit(problem.num1, 1) -
                  (borrowedPlaces.includes(0) ? 1 : 0)
            } minus ${getDigit(problem.num2, 1)} equals ${getDigit(
              problem.difference,
              1
            )}.`,
          },
          ...(level === 3
            ? [
                {
                  instruction: "Subtract the hundreds place",
                  voice: `Subtract the hundreds place: ${
                    getDigit(problem.num1, 2) -
                    (borrowedPlaces.includes(1) ? 1 : 0)
                  } minus ${getDigit(problem.num2, 2)} equals ${getDigit(
                    problem.difference,
                    2
                  )}.`,
                },
              ]
            : []),
        ]),
    {
      instruction: "Great job!",
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prevStep) => prevStep + 1);
      speakInstruction(steps[currentStep].voice);
      setCheckVoice(steps[currentStep].voice);

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

  // Display the borrowing arrows
  const renderBorrowArrow = (place: number) => {
    if (borrowedPlaces.includes(place)) {
      const stepToShow = place === 0 ? 1 : 3;

      return (
        <StepAnimation step={stepToShow} currentStep={currentStep} delay={300}>
          <div className="absolute -top-10 right-5 text-mathPink font-bold lg:text-2xl text-lg flex items-center">
            <ArrowDown className="h-4 w-4 mr-1" />1
          </div>
        </StepAnimation>
      );
    }
    return null;
  };

  // const generateOneDigitSubtraction = () => {
  //   const first = Math.floor(Math.random() * 8) + 1; // 1 to 9
  //   const second = Math.floor(Math.random() * first) + 1; // 1 to first number
  //   return { num1: first, num2: second, difference: first - second };
  // };

  // const generateTwoDigitSubtraction = () => {
  //   const first = Math.floor(Math.random() * 90) + 10; // 10 to 99
  //   const second = Math.floor(Math.random() * first) + 1; // 1 to first number
  //   return { num1: first, num2: second, difference: first - second };
  // };

  // const generateThreeDigitSubtraction = () => {
  //   const first = Math.floor(Math.random() * 400) + 100; // 100 to 499
  //   const second = Math.floor(Math.random() * first) + 1; // 1 to first number
  //   return { num1: first, num2: second, difference: first - second };
  // };

  const renderGeneralCase = () => (
    <div className="bg-slate-100 rounded-lg p-4 flex flex-col gap-4 justify-center items-center">
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-muted-foreground">
            First Number
          </label>
          <input
            type="number"
            value={userInput.num1}
            onChange={(e) => handleUserInput(e.target.value, "num1")}
            className="border rounded-md px-3 py-2 text-center text-lg placeholder:text-sm"
            placeholder="first number"
            min="0"
            max="999"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-muted-foreground">
            Second Number
          </label>
          <input
            type="number"
            value={userInput.num2}
            onChange={(e) => handleUserInput(e.target.value, "num2")}
            className="border rounded-md px-3 py-2 text-center text-lg placeholder:text-sm "
            placeholder="second number"
            min="0"
            max="999"
          />
        </div>
        <div className="flex justify-center items-center lg:mt-7 lg:ml-9 ">
          {!isCustomProblem && (
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={handleCustomProblem}
                className="w-full bg-mathRed bg-opacity-10 text-mathRed hover:bg-mathRed hover:text-white border-mathRed border-2 font-bold text-sm  lg:text-lg rounded-sm"
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 text-center border-2 border-black bg-zinc-100 rounded-lg px-4 py-2">
        <h3 className="text-xl font-medium  mb-2">
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

      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="col-span-1"></div>
        <div className="col-span-3 grid grid-cols-3 gap-3">
          {getPlaceValues().map((place) => (
            <div key={place} className="relative">
              <NumberBlock
                value={
                  isCustomProblem
                    ? getDigitWithBorrowing(problem.num1, place)
                    : getDigit(editableProblem.num1, place)
                }
                highlighted={
                  (place === 2 && currentStep >= 5) ||
                  (place === 1 && currentStep >= 3 && currentStep < 5) ||
                  (place === 0 && currentStep >= 1 && currentStep < 3)
                }
                editable={!isCustomProblem}
                onChange={(value) => handleUserInput(value, "num1")}
              />
              {renderBorrowVisualization(place)}
              {renderBorrowArrow(place)}
            </div>
          ))}
        </div>

        <div className="col-span-1 flex justify-end items-center">
          <span className="text-6xl font-medium">−</span>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-3">
          {getPlaceValues().map((place) => (
            <NumberBlock
              key={place}
              value={
                isCustomProblem
                  ? getDigit(problem.num2, place)
                  : getDigit(editableProblem.num2, place)
              }
              highlighted={
                (place === 2 && currentStep >= 5) ||
                (place === 1 && currentStep >= 4 && currentStep < 5) ||
                (place === 0 && currentStep >= 2 && currentStep < 3)
              }
              editable={!isCustomProblem}
              onChange={(value) => handleUserInput(value, "num2")}
            />
          ))}
        </div>

        <div className="col-span-4 border-b-2 border-gray-400 my-2"></div>

        <div className="col-span-1"></div>
        <div className={`col-span-3 flex gap-3 ${marginClass2} ${marginClass}`}>
          {getPlaceValues().map((place) => (
            <StepAnimation
              key={place}
              step={place === 0 ? 1 : place === 1 ? 3 : 5}
              currentStep={currentStep}
            >
              <NumberBlock
                value={getDigit(problem.difference, place)}
                color={completed ? "bg-mathGreen bg-opacity-20" : "bg-white"}
              />
            </StepAnimation>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
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
            <Button
              onClick={handleNextStep}
              className="font-extrabold bg-sky-100 border-sky-400 border-2 text-sky-400 hover:bg-sky-400 hover:text-white"
            >
              {checkVoice == "Great job! Click on Next Question"
                ? "Next Question"
                : "Next Step"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVisualize = () => (
    <div className="space-y-6 w-full">
      {level === 1 && (
        <VisualSubtract
          firstNumber={problem.num1}
          secondNumber={problem.num2}
        />
      )}
    </div>
  );

  const renderTipsAndTricks = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Subtraction Tips & Tricks
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Counting Back</h4>
            <p className="text-sm text-muted-foreground">
              Start from the first number and count backwards the second number
              of times.
              <br />
              Example: 8 - 3 = Start at 8, count back 3: 7, 6, 5
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Using Number Bonds</h4>
            <p className="text-sm text-muted-foreground">
              Break down the numbers into smaller parts that are easier to
              subtract.
              <br />
              Example: 15 - 7 = (10 - 7) + 5 = 3 + 5 = 8
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">3. Compensation Method</h4>
            <p className="text-sm text-muted-foreground">
              Adjust both numbers to make the subtraction easier.
              <br />
              Example: 23 - 18 = (23 + 2) - (18 + 2) = 25 - 20 = 5
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-end w-full mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="hover:bg-gray-100"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-4xl pointer-events-none bg-gradient-to-b from-purple-600 to-purple-300 font-bold bg-clip-text text-transparent mb-4">
          {getClassHeading()}
        </h2>

        {showHint && (
          <p className="text-sm text-fuchsia-500 font-bold">
            {steps[currentStep]?.voice}
          </p>
        )}
      </div>

      <Tabs
        defaultValue="general"
        className="w-full max-w-3xl"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 text-xs lg:text-sm px-4"
          >
            <Info className="h-4 w-4 hidden lg:block" />
            General Case
          </TabsTrigger>
          <TabsTrigger
            value="visualize"
            className="flex items-center gap-2 text-xs lg:text-sm"
          >
            <Eye className="h-4 w-4 hidden lg:block" />
            Visualize
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="flex items-center gap-2 text-xs lg:text-sm"
          >
            <Lightbulb className="h-4 w-4 hidden lg:block" />
            Tips & Tricks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">{renderGeneralCase()}</TabsContent>
        <TabsContent value="visualize">{renderVisualize()}</TabsContent>
        <TabsContent value="tips">{renderTipsAndTricks()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default SubtractionOperation;
