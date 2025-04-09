import React, { useState } from "react";
import { Apple } from "../components/addVisual1/Apple";
import { Bunny } from "../components/addVisual1/Bunny";
import { Cloud } from "../components/addVisual1/Cloud";

import { Butterfly } from "@/components/addVisual1/Butterfly";
import { BubbleNumber } from "@/components/addVisual1/BubbleNumber";
import { Input } from "@/components/ui/input";

interface VisualOneProps {
  firstNumber: number;
  secondNumber: number;
}

const VisualOne: React.FC<VisualOneProps> = ({ firstNumber, secondNumber }) => {
  const [isEditingFirst, setIsEditingFirst] = useState(false);
  const [isEditingSecond, setIsEditingSecond] = useState(false);
  const [tempValue, setTempValue] = useState("");

  // Calculate result
  const result = firstNumber + secondNumber;

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
  const renderApples = (count: number, startIndex: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Apple key={startIndex + i} index={startIndex + i} />
    ));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-blue">
      {/* Sun */}
      <div className="absolute top-8 right-12 w-24 h-24 bg-yellow-300 rounded-full shadow-lg animate-pulse">
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
      <Butterfly className="absolute top-32 left-40" color="#9B59B6" />{" "}
      {/* Purple */}
      <Butterfly className="absolute top-32 left-56" color="#E74C3C" />{" "}
      {/* Red */}
      <Butterfly className="absolute top-5 left-80" color="#3498DB" />{" "}
      {/* Blue */}
      {/* Main content - centered addition problem */}
      <div className="relative pt-32 pb-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white/70 rounded-3xl shadow-xl p-6 md:p-20  ">
          <div className="flex flex-col items-center">
            {/* Math problem visualization */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-6 mb-8">
              {/* First group of apples */}
              <div className="relative grid grid-cols-3 gap-2 w-36 h-64 px-2 bg-grass-green/50 rounded-xl">
                {renderApples(firstNumber, 0)}
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 ">
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
                      className="text-xl md:text-2xl"
                      onClick={() => startEditing("first")}
                      glow={true}
                    />
                  )}
                </div>
              </div>

              {/* Plus sign */}
              <BubbleNumber
                number="+"
                color="#E67E22"
                className="text-xl md:text-2xl"
                animated={false}
              />

              {/* Second group of apples */}
              <div className="relative grid grid-cols-3   gap-2 p-4 w-36 h-64 bg-grass-green/50 rounded-xl">
                {renderApples(secondNumber, 10)}
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
                      className="text-xl md:text-2xl"
                      glow={true}
                    />
                  )}
                </div>
              </div>

              {/* Equals sign */}
              <BubbleNumber
                number="="
                color="#9B59B6"
                className="text-xl md:text-2xl"
                animated={false}
              />

              {/* Result */}
              <div className="relative p-4 w-36 h-64 bg-grass-green/50 rounded-xl">
                <div className="grid grid-cols-3 gap-2 ">
                  {renderApples(result, 20)}
                </div>
                <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
                  <BubbleNumber
                    number={result}
                    color="#E74C3C"
                    className="text-xl md:text-2xl"
                    glow={true}
                  />
                </div>
              </div>
            </div>

            {/* Bunny character */}
            <div className="absolute bottom-80 right-44  ">
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

export default VisualOne;
