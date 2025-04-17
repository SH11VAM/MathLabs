import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ExampleProps {
  fraction: string;
  numerator: number;
  denominator: number;
  shape: "circle" | "rectangle" | "square";
  color: string;
  title: string;
}

const FractionExample: React.FC<ExampleProps> = ({
  fraction,
  numerator,
  denominator,
  shape,
  color,
  title,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Create an array to represent the parts of the shape
  const parts = Array.from({ length: denominator }, (_, i) => i);

  // Define shape dimensions and layout
  const getShapeClass = () => {
    switch (shape) {
      case "circle":
        return "rounded-lg";
      case "rectangle":
        return "rounded-lg";
      case "square":
        return "rounded-lg aspect-square";
      default:
        return "rounded-lg";
    }
  };

  // Layout parts based on shape type
  const getPartsLayout = () => {
    if (shape === "circle") {
      // For circle, create pie slices
      return (
        <div >
             <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-800">
             <div className="absolute inset-0 bg-white">
        <div className="absolute top-0 left-0 w-[50%] h-full bg-kid-red" />
        <div className="absolute top-0 left-[50%] w-[0%] h-full bg-white border-r-2 border-gray-800" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white" />
      </div>
    </div>
</div>
      );
    } else if (shape === "rectangle") {
      // For rectangle, create horizontal divisions
      return (
        <div className="flex flex-col w-48 h-24 border-2 border-gray-800">
          {parts.map((_, index) => (
            <div
              key={index}
              className={`flex-1 ${
                index < numerator ? `${color}` : "bg-white"
              } ${index < denominator - 1 ? "border-b-2 border-gray-800" : ""}`}
            />
          ))}
        </div>
      );
    } else {
      // For square, create a grid or horizontal divisions based on denominator
      // Simple implementation: horizontal divisions
      return (
        <div className="flex flex-col w-36 h-36 border-2 border-gray-800">
          {parts.map((part, index) => (
            <div
              key={index}
              className={`flex-1 ${
                index < numerator ? `${color}` : "bg-white"
              } ${index < denominator - 1 ? "border-b-2 border-gray-800" : ""}`}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-5 shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-3">{title}</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Shape with fractions */}
        <motion.div
          animate={isAnimating ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 1 }}
          className="relative"
        >
          {getPartsLayout()}

          {/* Fraction label */}
          <div className="absolute -top-4 -right-4 bg-white rounded-full h-12 w-12 flex items-center justify-center border-2 border-gray-700 shadow-md">
            <span className="text-lg font-bold">{fraction}</span>
          </div>
        </motion.div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-lg mb-3">
            This shape is divided into{" "}
            <span className="font-bold text-gray-700">
              {denominator} equal parts
            </span>
            .
          </p>
          <p className="text-lg mb-4">
            <span className="font-bold text-gray-700">{numerator}</span> of
            those parts are shaded.
          </p>

          <Button
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 1000);
            }}
            className="bg-kid-purple hover:bg-purple-600 text-white"
          >
            Wiggle It!
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const FractionExamples: React.FC = () => {
  return (
    <div className="bg-kid-yellow rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Examples of Fractions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
        <FractionExample
          fraction="1/2"
          numerator={1}
          denominator={2}
          shape="circle"
          color="bg-kid-red"
          title="One-Half (1/2)"
        />

        <FractionExample
          fraction="1/3"
          numerator={1}
          denominator={3}
          shape="rectangle"
          color="bg-kid-blue"
          title="One-Third (1/3)"
        />

        <FractionExample
          fraction="1/4"
          numerator={1}
          denominator={4}
          shape="square"
          color="bg-kid-green"
          title="One-Fourth (1/4)"
        />
      </div>
    </div>
  );
};

export default FractionExamples;
