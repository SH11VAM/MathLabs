import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
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
import { generateAdditionProblem } from "../utils/mathProblems";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import VisualOne from "@/components/VisualOne";


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
  const [checkVoice ,setCheckVoice ]= useState("");

  const generateTwoDigitAddition = () => {
    const first = Math.floor(Math.random() * 90) + 10; // 10 to 99
    const maxSecond = Math.min(99 - first, 99);
    const second = Math.floor(Math.random() * (maxSecond - 9)) + 10;
    return { num1: first, num2: second, sum: first + second };
  };

  const generateOneDigitAddition = () => {
    const first = Math.floor(Math.random() * 8) + 1; // 1 to 9
    const maxSecond = 9 - first;
    const second = Math.floor(Math.random() * maxSecond) + 1;
    return { num1: first, num2: second, sum: first + second };
  };

  const generateThreeDigitAddition = () => {
    const first = Math.floor(Math.random() * 400) + 100; // 100 to 499
    const maxSecond = 499 - first;
    const second = Math.floor(Math.random() * maxSecond) + 100;
    return { num1: first, num2: second, sum: first + second };
  };

  useEffect(() => {
    let newProblem;
    switch (level) {
      case 1:
        newProblem = generateOneDigitAddition();
        break;
      case 2:
        newProblem = generateTwoDigitAddition();
        break;
      case 3:
        newProblem = generateThreeDigitAddition();
        break;
      default:
        newProblem = generateOneDigitAddition();
    }
    setProblem(newProblem);
    setEditableProblem({ num1: newProblem.num1, num2: newProblem.num2 });
    setCurrentStep(0);
    setCarryValues(calculateCarryValues(newProblem.num1, newProblem.num2));
    setCompleted(false);
    setShowHint(false);
    setIsCustomProblem(false);
  }, [level]);

  const marginClass = level === 1 ? "lg:mr-44 mr-24" : level === 2 ? "lg:mr-24 mr-10" : "mr-0";
  const marginClass2 = level === 1 ? "justify-self-center" : " justify-self-end";

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

  const getClassHeading = () => {
    switch (level) {
      case 1:
        return "One-Digit Addition";
      case 2:
        return "Two-Digit Addition";
      case 3:
        return "Three-Digit Addition";
      default:
        return "Addition";
    }
  };

  const getMaxDigits = () => {
    switch (level) {
      case 1:
        return 1; // One digit for class 1
      case 2:
        return 2; // Two digits for class 2
      case 3:
        return 3; // Three digits for class 3
      default:
        return 3; // Default to three digits
    }
  };

  const getMaxNumber = () => {
    switch (level) {
      case 1:
        return 9; // One digit numbers (0-9)
      case 2:
        return 49; // Two digit numbers (0-49) to ensure sum doesn't exceed 99
      case 3:
        return 499; // Three digit numbers (0-499) to ensure sum doesn't exceed 999
      default:
        return 499;
    }
  };

  const getMaxResult = () => {
    switch (level) {
      case 1:
        return 9; // One digit result (0-9)
      case 2:
        return 98; // Two digit result (0-98)
      case 3:
        return 999; // Three digit result (0-999)
      default:
        return 999;
    }
  };

  const steps = [
    {
      instruction:
        level === 1
          ? "Let's add these numbers"
          : "Let's add these numbers digit by digit",
      voice:
        level === 1
          ? `Count the total: ${problem.num1} plus ${problem.num2} equals ${problem.sum}.`
          : ` Add the ones place: ${getDigit(problem.num1, 0)} plus ${getDigit(
              problem.num2,
              0
            )} equals ${getDigit(problem.sum, 0)}${
              carryValues.includes(0) ? " with a carry of 1" : ""
            }.`,
    },
    {
      instruction: level === 1 ? "Count the total" : "Add the ones place",
      voice:
        level === 1
          ?`Great job! Click on Next Question`
          : "Tens Place ",
    },
    ...(level > 1 && carryValues.includes(0)
      ? [
          {
            instruction: "Carry the 1 to the tens place",
            voice: `Add the tens place: ${getDigit(
              problem.num1,
              1
            )} plus ${getDigit(problem.num2, 1)} ${
              carryValues.includes(0) ? "plus the carried 1 " : ""
            }equals ${getDigit(problem.sum, 1)}${
              carryValues.includes(1) ? " with a carry of 1" : ""
            }.`,
          },
        ]
      : []),
    ...(level > 1
      ? [
          {
            instruction: "Add the tens place",
            voice: `Add the tens place: ${getDigit(
              problem.num1,
              1
            )} plus ${getDigit(problem.num2, 1)} ${
              carryValues.includes(0) ? "plus the carried 1 " : ""
            }equals ${getDigit(problem.sum, 1)}${
              carryValues.includes(1) ? " with a carry of 1" : ""
            }.`,
          },
        ]
      : []),
    ...(level > 2 && carryValues.includes(1)
      ? [
          {
            instruction: "Carry the 1 to the hundreds place",
            voice: "Carry the 1 to the hundreds place.",
          },
        ]
      : []),
    ...(level === 3
      ? [
          {
            instruction: "Add the hundreds place",
            voice: `Add the hundreds place: ${getDigit(
              problem.num1,
              2
            )} plus ${getDigit(problem.num2, 2)} ${
              carryValues.includes(1) ? "plus the carried 1 " : ""
            }equals ${getDigit(problem.sum, 2)}.`,
          },
        ]
      : []),
    {
      instruction: "Great job!",
      
    },
  ];

  const handleCustomProblem = () => {
    try {
      const maxNumber = getMaxNumber();
      const maxResult = getMaxResult();
      const customSum = editableProblem.num1 + editableProblem.num2;

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

      // Check if the sum would exceed the maximum allowed result
      if (customSum > maxResult) {
        toast({
          title: "Invalid Problem",
          description: `The sum cannot exceed ${maxResult} for ${getClassHeading()}`,
          variant: "destructive",
        });
        return;
      }

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

    const maxNumber = getMaxNumber();
    const maxResult = getMaxResult();
    const otherNum =
      field === "num1" ? editableProblem.num2 : editableProblem.num1;
    const potentialSum =
      field === "num1" ? numValue + otherNum : otherNum + numValue;

    // Check if the input number exceeds the maximum allowed for the class level
    if (numValue > maxNumber) {
      toast({
        title: "Invalid Input",
        description: `For ${getClassHeading()}, numbers cannot exceed ${maxNumber}`,
        variant: "destructive",
      });
      return;
    }

    // Check if the sum would exceed the maximum allowed result
    if (potentialSum > maxResult) {
      toast({
        title: "Invalid Input",
        description: `The sum cannot exceed ${maxResult} for ${getClassHeading()}`,
        variant: "destructive",
      });
      return;
    }

    const newProblem = {
      num1: field === "num1" ? numValue : editableProblem.num1,
      num2: field === "num2" ? numValue : editableProblem.num2,
      sum: potentialSum,
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

  // Display the digits of a place value with carrying animation
  const renderCarryDigit = (place: number) => {
    const prevPlaceValue =
      getDigit(problem.num1, place - 1) + getDigit(problem.num2, place - 1);
    const hasCarry = prevPlaceValue >= 10;
    const stepToShow = place === 1 ? 2 : 4;

    if (hasCarry && currentStep >= stepToShow) {
      return (
        <StepAnimation step={stepToShow} currentStep={currentStep} delay={300}>
          <div className="absolute -top-8 right-4 text-mathPink font-bold lg:text-3xl text-lg flex items-center mb-10  ">
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
    <div className="bg-slate-100 rounded-lg p-4 flex flex-col gap-4 justify-center items-center ">
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-md ">
        <div className="flex flex-col gap-2">
          <label className="lg:text-sm text-[12px] font-extrabold text-muted-foreground">
            First Number
          </label>
          <input
            type="number"
            value={userInput.num1}
            onChange={(e) => handleUserInput(e.target.value, "num1")}
            className="border rounded-md px-3 py-2 text-center lg:text-lg text-sm placeholder:text-sm"
            placeholder="first number"
            min="0"
            max="999"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="lg:text-sm text-[12px] font-extrabold text-muted-foreground">
            Second Number
          </label>
          <input
            type="number"
            value={userInput.num2}
            onChange={(e) => handleUserInput(e.target.value, "num2")}
            className="border rounded-md px-3 py-2   text-center lg:text-lg text-sm placeholder:text-sm"
            placeholder="second number"
            min="0"
            max="999"
          />
        </div>
        <div className="lg:ml-10 mr-10 mt-7 flex flex-col gap-2">
          {!isCustomProblem && (
            <div className="mb-4  ">
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

      <div className="border-2 border-mathGreen rounded-lg px-4 py-2 bg-green-100/50">
        {" "}
        <h3 className="lg:text-xl text-sm font-bold text-mathGreen  mb-2">
          {currentStep < steps.length
            ? steps[currentStep].instruction
            : steps[steps.length - 1].instruction}
        </h3>
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
                <div className="text-mathPink font-bold lg:text-3xl text-lg flex justify-center items-center h-6">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="bg-white px-1 rounded">1</span>
                </div>
              </StepAnimation>
            ) : (
              " "
            )
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
        <div
          className={`col-span-3 flex ${marginClass2} ${marginClass} gap-2 `}
        >
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
            <Button onClick={handleNextStep} className="font-extrabold bg-sky-100 border-sky-400 border-2 text-sky-400 hover:bg-sky-400 hover:text-white">{checkVoice== "Great job! Click on Next Question"? "Next Question": "Next Step"}</Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVisualize = () => (
    <div className="space-y-6 w-full">
      {level === 1 && (
        <VisualOne firstNumber={problem.num1} secondNumber={problem.num2} />
      )}
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
              Break down large numbers into smaller, more manageable parts. For
              example:
              <br />
              123 + 456 = (100 + 400) + (20 + 50) + (3 + 6) = 500 + 70 + 9 = 579
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">2. Use Number Bonds</h4>
            <p className="text-sm text-muted-foreground">
              Use number bonds to make 10 or 100. For example:
              <br />7 + 8 = (7 + 3) + 5 = 10 + 5 = 15
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
        <h2 className="text-4xl pointer-events-none bg-gradient-to-b from-orange-500 to-yellow-400 font-bold bg-clip-text text-transparent mb-4">
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
        className="w-full max-w-3xl "
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 px-2">
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

export default AdditionOperation;
