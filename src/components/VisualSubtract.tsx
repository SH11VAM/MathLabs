import React, { useState } from "react";
import { Bunny } from "../components/addVisual1/Bunny";
import { Cloud } from "../components/addVisual1/Cloud";
import { Butterfly } from "@/components/addVisual1/Butterfly";
import { BubbleNumber } from "@/components/addVisual1/BubbleNumber";
import { Input } from "@/components/ui/input";
import { Mango } from "./addVisual1/Mango";

interface VisualSubtractProps {
  firstNumber: number;
  secondNumber: number;
}

const VisualSubtract: React.FC<VisualSubtractProps> = ({ firstNumber, secondNumber }) => {
  const [isEditingFirst, setIsEditingFirst] = useState(false);
  const [isEditingSecond, setIsEditingSecond] = useState(false);
  const [tempValue, setTempValue] = useState("");

  // Calculate result
  const result = firstNumber - secondNumber;

  // Handle editing of numbers
  const startEditing = (which: "first" | "second") => {
    if (which === "first") {
      setIsEditingFirst(true);
      setTempValue(firstNumber.toString());
    } else {
      setIsEditingSecond(true);
      setTempValue(secondNumber.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 2) {
      setTempValue(value);
    }
  };

  const handleInputBlur = () => {
    setIsEditingFirst(false);
    setIsEditingSecond(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleInputBlur();
    }
  };

  // Generate apples based on current number
  const renderMango = (count: number, startIndex: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Mango key={startIndex + i} index={startIndex + i}  />
    ));
  };

  return (
    <div className="relative lg:min-h-screen overflow-hidden bg-sky-blue lg:w-full w-[42vh]">
      {/* Sun */}
      <div className="absolute lg:top-8 top-3 right-6 lg:right-12 lg:w-24 lg:h-24 bg-yellow-300 rounded-full shadow-lg animate-pulse">
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-16 bg-yellow-300 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${
                i * 45
              }deg) translateY(-20px)`,
            }}
          ></div>
        ))}
      </div>
      {/* Clouds */}
      <Cloud className="absolute top-12 left-12" size="lg" />
      <Cloud className="absolute top-24 right-36" size="sm" />
      <Cloud
        className="absolute top-16 left-1/2 transform -translate-x-1/2"
        size="md"
      />
      {/* Butterflies */}
      <Butterfly className="absolute top-16 left-20 lg:top-32 lg:left-40" color="#9B59B6" />
      <Butterfly className="absolute top-16 left-28 lg:top-32 lg:left-56" color="#E74C3C" />
      <Butterfly className="absolute top-2 left-40 lg:top-5 lg:left-80" color="#3498DB" />
      {/* Main content - centered subtraction problem */}
      <div className="relative pt-32 pb-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white/70 rounded-3xl shadow-xl p-6 md:p-20">
          <div className="flex flex-col items-center">
            {/* Math problem visualization */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-6 mb-8">
              {/* First group of apples */}
              <div className="relative grid  lg:grid-cols-3 grid-cols-5 gap-2 lg:w-36 lg:h-64 w-64 h-36 px-2 bg-grass-green/50 rounded-xl">
                {renderMango(firstNumber, 0)}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                  {isEditingFirst ? (
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <Input
                        type="text"
                        value={tempValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        className="w-16 h-16 text-center text-3xl font-bubble"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <BubbleNumber
                      number={firstNumber}
                      color="#3498DB"
                      className="text-2xl md:text-4xl mt-11 lg:mt-0"
                      onClick={() => startEditing("first")}
                      glow={true}
                    />
                  )}
                </div>
              </div>

              {/* Minus sign */}
              <BubbleNumber
                number="-"
                color="#E67E22"
                className="text-2xl md:text-4xl"
                animated={false}
              />

              {/* Second group of apples */}
              <div className="relative grid  lg:grid-cols-3 grid-cols-5 gap-2 p-4 lg:w-36 lg:h-64 w-64 h-36 bg-grass-green/50 rounded-xl">
                {renderMango(secondNumber, 10)}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                  {isEditingSecond ? (
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <Input
                        type="text"
                        value={tempValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        className="w-16 h-16 text-center text-3xl font-bubble"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <BubbleNumber
                      number={secondNumber}
                      color="#2ECC71"
                      onClick={() => startEditing("second")}
                      className="text-2xl md:text-4xl mt-20 lg:mt-0"
                      glow={true}
                    />
                  )}
                </div>
              </div>

              {/* Equals sign */}
              <BubbleNumber
                number="="
                color="#9B59B6"
                className="text-2xl md:text-4xl"
                animated={false}
              />

              {/* Result */}
              <div className="relative p-4 lg:w-36 lg:h-64 w-64 h-36 bg-grass-green/50 rounded-xl">
                <div className="grid  lg:grid-cols-3 grid-cols-5 gap-2 mt-3">
                  {renderMango(result, 20)}
                </div>
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                  <BubbleNumber
                    number={result}
                    color="#E74C3C"
                    className="text-2xl md:text-4xl mt-20 lg:mt-0"
                    glow={true}
                  />
                </div>
              </div>
            </div>

            {/* Bunny character */}
            <div className="absolute lg:bottom-80 lg:right-44 bottom-40 right-4">
              <Bunny />
            </div>
          </div>
        </div>

        {/* Ground with grass */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-grass-green">
          {/* Grass blades */}
          <div className="absolute top-0 left-0 w-full flex justify-around">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-12 bg-green-600 rounded-t-full"
                style={{
                  transform: i % 2 === 0 ? "rotate(-5deg)" : "rotate(5deg)",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSubtract; 