
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Shape, { ShapeType, ShapeColor } from '@/components/pattern/shapes/Shape';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GrowingPatternProps {
  level?: number;
  onComplete?: () => void;
}

const GrowingPattern: React.FC<GrowingPatternProps> = ({ 
  level = 1,
  onComplete
}) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [shapeType, setShapeType] = useState<ShapeType>('square');
  const [shapeColor, setShapeColor] = useState<ShapeColor>('blue');

  // Generate a new pattern based on the level
  const generatePattern = () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setHintUsed(false);
    
    // Choose random shape and color
    const randomType = ['circle', 'square', 'triangle', 'diamond'][Math.floor(Math.random() * 4)] as ShapeType;
    const randomColor = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'][Math.floor(Math.random() * 6)] as ShapeColor;
    
    setShapeType(randomType);
    setShapeColor(randomColor);
    
    // Generate growing pattern based on level
    let newPattern: number[] = [];
    let rule = 'add';
    let increment = 1;
    
    // Adjust complexity based on level
    if (level <= 2) {
      // Simple +1 pattern (1, 2, 3, 4)
      rule = 'add';
      increment = 1;
    } else if (level <= 4) {
      // +2 pattern (2, 4, 6, 8) or (1, 3, 5, 7)
      rule = 'add';
      increment = 2;
    } else if (level <= 6) {
      // Multiply pattern (1, 2, 4, 8) or (2, 4, 8, 16)
      rule = 'multiply';
      increment = 2;
    } else {
      // More complex patterns for higher levels
      const rules = ['add', 'multiply'];
      rule = rules[Math.floor(Math.random() * rules.length)];
      increment = rule === 'add' ? Math.floor(Math.random() * 3) + 1 : 2;
    }
    
    // Starting value
    let start = 1;
    if (level > 3 && Math.random() > 0.5) {
      start = Math.floor(Math.random() * 3) + 1;
    }
    
    // Generate sequence
    let value = start;
    for (let i = 0; i < 4; i++) {
      newPattern.push(value);
      if (rule === 'add') {
        value += increment;
      } else {
        value *= increment;
      }
    }
    
    setPattern(newPattern);
    
    // Correct answer is the next value in sequence
    const correctAnswer = rule === 'add' ? newPattern[3] + increment : newPattern[3] * increment;
    
    // Generate distractors
    const distractors: number[] = [];
    while (distractors.length < 3) {
      let distractor: number;
      
      if (rule === 'add') {
        // Create plausible wrong answers
        // e.g., using wrong increment, or adding a previous value
        const options = [
          correctAnswer + 1,
          correctAnswer - 1,
          correctAnswer + increment + 1,
          newPattern[2] + newPattern[3],
          newPattern[3] + Math.floor(increment / 2)
        ];
        distractor = options[Math.floor(Math.random() * options.length)];
      } else {
        // For multiplication, offer likely wrong answers
        const options = [
          correctAnswer + increment,
          correctAnswer - increment,
          newPattern[3] + newPattern[2],
          newPattern[3] + (newPattern[3] - newPattern[2]),
          Math.floor(correctAnswer * 1.2),
          Math.floor(correctAnswer * 0.8)
        ];
        distractor = options[Math.floor(Math.random() * options.length)];
      }
      
      // Ensure no duplicate distractors
      if (distractor !== correctAnswer && !distractors.includes(distractor) && distractor > 0) {
        distractors.push(distractor);
      }
    }
    
    // Add correct answer and shuffle options
    const newOptions = [...distractors, correctAnswer];
    for (let i = newOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
    }
    
    setOptions(newOptions);
    setIsLoading(false);
  };
  
  // Handle option selection
  const handleOptionSelect = (index: number) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedOption(index);
    
    // Determine correct answer based on pattern
    let correctAnswer: number;
    if (pattern[1] - pattern[0] === pattern[2] - pattern[1] && pattern[2] - pattern[1] === pattern[3] - pattern[2]) {
      // Arithmetic sequence (add)
      const increment = pattern[1] - pattern[0];
      correctAnswer = pattern[3] + increment;
    } else if (pattern[1] / pattern[0] === pattern[2] / pattern[1] && pattern[2] / pattern[1] === pattern[3] / pattern[2]) {
      // Geometric sequence (multiply)
      const multiplier = pattern[1] / pattern[0];
      correctAnswer = pattern[3] * multiplier;
    } else {
      // Fallback (just in case)
      correctAnswer = options[index];
    }
    
    const isAnswerCorrect = options[index] === correctAnswer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      toast.success("Great job! You found the pattern!");
      // Add points based on hint usage
      const points = hintUsed ? 1 : 2;
      setScore(prev => prev + points);
      
      // Wait a bit before generating a new pattern
      setTimeout(() => {
        generatePattern();
      }, 1500);
    } else {
      toast.error("That's not the next number in the pattern. Try again!");
    }
  };
  
  // Show hint
  const showHint = () => {
    setHintUsed(true);
    
    // Determine pattern type
    if (pattern[1] - pattern[0] === pattern[2] - pattern[1] && pattern[2] - pattern[1] === pattern[3] - pattern[2]) {
      // Arithmetic sequence (add)
      const increment = pattern[1] - pattern[0];
      toast.info("This is an increasing pattern!", {
        description: `Look carefully at how much the number increases each time (+${increment}).`
      });
    } else if (pattern[1] / pattern[0] === pattern[2] / pattern[1] && pattern[2] / pattern[1] === pattern[3] / pattern[2]) {
      // Geometric sequence (multiply)
      const multiplier = pattern[1] / pattern[0];
      toast.info("This is a multiplying pattern!", {
        description: `Look carefully at how the number changes each time (×${multiplier}).`
      });
    }
  };
  
  // Generate initial pattern on mount
  useEffect(() => {
    generatePattern();
  }, [level]);
  
  return (
    <Card className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Growing Pattern</h2>
        <p className="text-gray-500 mb-4">Find how the pattern grows and predict the next number</p>
        <div className="flex justify-center items-center gap-2">
          <span className="font-semibold">Score: {score}</span>
          <Separator orientation="vertical" className="h-6" />
          <span className="font-semibold">Level: {level}</span>
        </div>
      </div>
      
      <div className="bg-green-50 p-6 rounded-xl mb-8">
        <div className="flex flex-col items-center space-y-6">
          {pattern.map((count, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2">
              <div className="w-8 text-right font-bold">{rowIndex + 1}</div>
              <div className="flex gap-2">
                {Array.from({ length: count }).map((_, i) => (
                  <Shape 
                    key={i}
                    type={shapeType} 
                    color={shapeColor}
                    size="md" 
                  />
                ))}
              </div>
              <div className="w-8 text-left font-bold">{count}</div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-8 text-right font-bold">5</div>
            <div className="flex gap-2 min-h-[3rem] items-center">
              {selectedOption !== null && (
                <>
                  {Array.from({ length: options[selectedOption] }).map((_, i) => (
                    <Shape 
                      key={i}
                      type={shapeType} 
                      color={shapeColor}
                      size="md"
                      className={isCorrect ? 'animate-scale-up' : ''}
                    />
                  ))}
                </>
              )}
              {selectedOption === null && (
                <div className="border-4 border-dashed border-green-300 rounded-lg w-12 h-12 flex items-center justify-center">
                  <span className="text-2xl text-green-400">?</span>
                </div>
              )}
            </div>
            <div className="w-8 text-left font-bold">?</div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">How many shapes will be in row 5?</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {options.map((option, index) => (
            <button
              key={index}
              className={`
                p-4 rounded-xl flex justify-center items-center border-2 transition-all
                ${selectedOption === index && isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${selectedOption === index && isCorrect === false ? 'border-red-500 bg-red-50' : ''}
                ${selectedOption !== index && selectedOption !== null ? 'opacity-50' : ''}
                ${selectedOption === null ? 'border-gray-200 hover:border-green-300 hover:bg-green-50' : ''}
              `}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              <span className="text-2xl font-bold">{option}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={showHint}
          disabled={hintUsed || isCorrect !== null}
        >
          Show Hint
        </Button>
        <Button
          onClick={generatePattern}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          New Pattern
        </Button>
      </div>
    </Card>
  );
};

export default GrowingPattern;
