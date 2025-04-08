import React, { useState, useEffect } from "react";
import { MultiplicationState, CalculationStep } from "@/types/multiplication";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DigitGridProps {
  state: MultiplicationState;
  currentStep: CalculationStep;
}

const DigitGrid: React.FC<DigitGridProps> = ({ state, currentStep }) => {
  const { multiplicand, multiplier } = state;
  const multiplicandDigits = multiplicand.toString().split("").map(Number);
  const multiplierDigits = multiplier.toString().split("").map(Number);
  const [visibleDigits, setVisibleDigits] = useState<number[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);

  // Reset visible digits when step changes
  useEffect(() => {
    setVisibleDigits([]);
    setShowFireworks(false);
  }, [currentStep]);

  // Show digits one by one with delay
  useEffect(() => {
    if (currentStep.type === "finalSum" && currentStep.finalProduct) {
      const showNextDigit = (index: number) => {
        // Start from the last index (rightmost digit)
        const currentIndex = currentStep.finalProduct!.length - 1 - index;
        if (currentIndex >= 0) {
          setTimeout(() => {
            setVisibleDigits(prev => [...prev, currentIndex]);
            if (currentIndex === 0) {
              // Show fireworks after first digit (leftmost)
              setTimeout(() => {
                setShowFireworks(true);
              }, 5000);
            } else {
              showNextDigit(index + 1);
            }
          }, 1000);
        }
      };
      showNextDigit(0);
    }
  }, [currentStep]);

  // Fireworks animation component
  const Fireworks = () => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{ 
              x: "50%", 
              y: "50%",
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1,
              delay: i * 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };

  // Convert for rendering - padded for alignment
  const renderMultiplicand = multiplicandDigits.map((digit, index) => ({
    value: digit,
    isHighlighted:
      currentStep.highlightPositions?.multiplicand?.includes(index) || false,
  }));

  const renderMultiplier = multiplierDigits.map((digit, index) => ({
    value: digit,
    isHighlighted:
      currentStep.highlightPositions?.multiplier?.includes(index) || false,
  }));

  // Determine the maximum width needed for grid (max of all partial products length)
  let maxWidth = Math.max(
    multiplicandDigits.length,
    multiplierDigits.length,
    ...(currentStep.partialProducts || []).map((pp) => pp.length)
  );

  // Add extra space for carried digits
  maxWidth += 1;

  // Functions to determine cell styling based on highlights
  const getMultiplicandCellStyle = (index: number) => {
    return cn(
      "grid-cell relative",
      renderMultiplicand[index]?.isHighlighted ? "digit-highlight" : ""
    );
  };

  const getMultiplierCellStyle = (index: number) => {
    return cn(
      "grid-cell relative",
      renderMultiplier[index]?.isHighlighted ? "multiply-highlight" : ""
    );
  };

  // Render the partial products
  const renderPartialProducts = () => {
    if (
      !currentStep.partialProducts ||
      currentStep.partialProducts.length === 0
    ) {
      return null;
    }

    return (
      <>
        {currentStep.partialProducts.map((product, productIndex) => {
          // Calculate padding needed for proper alignment
          const padding =
            currentStep.partialProducts!.length - 1 - productIndex;
          const paddedProduct = [...product];

          console.log("product ",product);
          // Add padding zeros to the right for place value
          for (let i = 0; i < padding; i++) {
            paddedProduct.push();
          }

          // Calculate total slots needed with padding
          const totalSlots = maxWidth;
          const leftPadding = totalSlots - paddedProduct.length;

          // Determine if this product is highlighted in the current step
          const isCurrentProduct =
            productIndex === currentStep.currentPartialProductIndex;

          return (
            <div
              key={`product-${productIndex}`}
              className="flex justify-end items-center h-12"
            >
              <div className={`${currentStep.type === "finalSum" && productIndex == 1  ? "grid font-bold text-2xl text-red-500" : "hidden"}`}  >+</div>
              
            

              {/* Add empty cells for left padding if needed */}
              {Array.from({ length: leftPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="grid-cell"></div>
              ))}
              

              {/* Render each digit of the partial product */}
              {paddedProduct.map((digit, digitIndex) => {
                const isHighlighted =
                  isCurrentProduct &&
                  currentStep.highlightPositions?.product?.includes(digitIndex);

                return (
                  <div
                    key={`digit-${digitIndex}`}
                    className={cn(
                      "grid-cell",
                      isHighlighted ? "step-highlight" : "",
                      currentStep.type === "finalSum" ? "font-bold" : ""
                    )}
                  >
                    {digit}
                    
                  </div>
                );
              })}
          
            </div>
          );
        })}

        {/* Render the sum line if we're at the final step */}
        {currentStep.type === "finalSum" && (
          <>
            <div className="grid-line"></div>
            <div className="flex justify-end items-center h-12 gap-x-1.5">
              {Array.from({
                length: maxWidth - (currentStep.finalProduct?.length || 0),
              }).map((_, i) => (
                <div key={`sum-pad-${i}`} className="grid-cell"></div>
              ))}

              {currentStep.finalProduct?.map((digit, index) => (
                <div
                  key={`sum-${index}`}
                  className={cn(
                    "grid-cell result-highlight",
                    !visibleDigits.includes(index) && "opacity-0"
                  )}
                >
                  {digit}

                  
                </div>
                
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in relative">
      {showFireworks && <Fireworks />}
      <div className="w-full overflow-x-auto py-8">
        <div className="flex flex-col items-center min-w-fit mx-auto">
          {/* Carried digits row */}

          <div className="flex justify-end items-center h-6 mb-1">

            {
            
            Array.from({ length: maxWidth }).map((_, index) => {

              const carryValue = currentStep.carryValues?.[index];
              const isHighlighted = currentStep.highlightPositions?.carry?.includes(index);

              return (
                <div
                  key={`carry-${index}`}
                  className={cn(
                    "flex h-6 text-2xl relative",
                    isHighlighted ? "text-mathRed animate-pulse" : ""
                  )}
                >
                  <div className={`absolute -top-1 -right-7 `}>
                    {carryValue !== undefined ? (
                      <div className="flex items-center ">
                        <span className="text-mathRed">↑</span>
                        <span className="ml-1 bg-white px-1 rounded">
                          {carryValue}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Multiplicand row */}
          <div className="flex justify-end items-center h-12">
            {Array.from({ length: maxWidth - renderMultiplicand.length }).map(
              (_, i) => (
                <div key={`top-pad-${i}`} className="grid-cell"></div>
              )
            )}

            {renderMultiplicand.map((digit, index) => (
              <div
                key={`top-${index}`}
                className={getMultiplicandCellStyle(index)}
              >
                {digit.value}
              </div>
            ))}
          </div>

          {/* Multiplier row */}
          <div className="flex justify-end items-center h-12">
            {Array.from({ length: maxWidth - renderMultiplier.length - 1 }).map(
              (_, i) => (
                <div key={`bottom-pad-${i}`} className="grid-cell"></div>
              )
            )}

            <div className="grid-cell font-bold text-mathBlue">×</div>

            {renderMultiplier.map((digit, index) => (
              <div
                key={`bottom-${index}`}
                className={getMultiplierCellStyle(index)}
              >
                {digit.value}
              </div>
            ))}
          </div>

          {/* Separation line */}
          <div className="grid-line"></div>

          {/* Partial products */}
          {renderPartialProducts()}
        </div>
      </div>
    </div>
  );
};

export default DigitGrid;
