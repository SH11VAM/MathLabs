
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Shape, { ShapeType, ShapeColor } from '@/components/pattern/shapes/Shape';
import Pattern, { PatternItem } from '@/components/pattern/patterns/Pattern';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const shapeTypes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond'];
const shapeColors: ShapeColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

interface FindNextShapeProps {
  level?: number;
  onComplete?: () => void;
}

const FindNextShape: React.FC<FindNextShapeProps> = ({ 
  level = 1,
  onComplete
}) => {
  const [pattern, setPattern] = useState<PatternItem[]>([]);
  const [options, setOptions] = useState<PatternItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [patternLength, setPatternLength] = useState(3);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  // Generate a new pattern based on the level
  const generatePattern = () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setHintUsed(false);
    
    // Adjust pattern complexity based on level
    const newPatternLength = Math.min(3 + Math.floor(level / 2), 7);
    setPatternLength(newPatternLength);
    
    // Simple pattern: repeating sequence (e.g., A-B-A-B)
    let newPattern: PatternItem[] = [];
    
    // Create a repeating pattern
    const repeatLength = Math.max(2, Math.min(3, level));
    const patternBase: PatternItem[] = [];
    
    for (let i = 0; i < repeatLength; i++) {
      const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const randomColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      patternBase.push({ type: randomType, color: randomColor });
    }
    
    // Repeat the pattern
    for (let i = 0; i < newPatternLength; i++) {
      newPattern.push(patternBase[i % repeatLength]);
    }
    
    setPattern(newPattern);
    
    // Generate options (correct + 3 distractors)
    const correctAnswer = newPattern[newPattern.length % repeatLength];
    
    const distractors: PatternItem[] = [];
    while (distractors.length < 3) {
      const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const randomColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      const newDistractor = { type: randomType, color: randomColor };
      
      // Make sure the distractor is not the same as the correct answer or other distractors
      if (!isPatternItemEqual(newDistractor, correctAnswer) && 
          !distractors.some(d => isPatternItemEqual(d, newDistractor))) {
        distractors.push(newDistractor);
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
  
  // Check if two pattern items are equal
  const isPatternItemEqual = (a: PatternItem, b: PatternItem) => {
    return a.type === b.type && a.color === b.color;
  };
  
  // Handle option selection
  const handleOptionSelect = (index: number) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedOption(index);
    
    const repeatLength = Math.max(2, Math.min(3, level));
    const correctAnswer = pattern[pattern.length % repeatLength];
    
    const isAnswerCorrect = isPatternItemEqual(options[index], correctAnswer);
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      toast.success("That's correct! Great job!");
      // Add a point if hint wasn't used
      const points = hintUsed ? 1 : 2;
      setScore(prev => prev + points);
      
      // Wait a bit before generating a new pattern
      setTimeout(() => {
        generatePattern();
      }, 1500);
      
    } else {
      toast.error("Not quite right. Try again!");
    }
  };
  
  // Show hint
  const showHint = () => {
    setHintUsed(true);
    
    // Find repeating pattern
    const repeatLength = Math.max(2, Math.min(3, level));
    
    // Highlight the repeating pattern
    let currentIndex = 0;
    const interval = setInterval(() => {
      setHighlightIndex(currentIndex % pattern.length);
      currentIndex++;
      
      if (currentIndex > pattern.length * 2) {
        clearInterval(interval);
        setHighlightIndex(null);
        
        // After showing the pattern, highlight the correct answer
        const correctAnswer = pattern[pattern.length % repeatLength];
        toast.info("Look carefully at the repeating pattern!", {
          description: "The next shape will continue the pattern."
        });
      }
    }, 600);
  };
  
  // Generate initial pattern on mount
  useEffect(() => {
    generatePattern();
  }, [level]);
  
  return (
    <Card className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Find the Next Shape</h2>
        <p className="text-gray-500 mb-4">What shape comes next in the pattern?</p>
        <div className="flex justify-center items-center gap-2">
          <span className="font-semibold">Score: {score}</span>
          <Separator orientation="vertical" className="h-6" />
          <span className="font-semibold">Level: {level}</span>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl mb-8">
        <Pattern 
          pattern={pattern} 
          showPlaceholder 
          size="lg"
          highlightIndex={highlightIndex !== null ? highlightIndex : undefined} 
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Choose the next shape:</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`
                cursor-pointer p-4 rounded-xl flex justify-center items-center border-2 transition-all
                ${selectedOption === index && isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${selectedOption === index && isCorrect === false ? 'border-red-500 bg-red-50' : ''}
                ${selectedOption !== index && selectedOption !== null ? 'opacity-50' : ''}
                ${selectedOption === null ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' : ''}
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <Shape 
                type={option.type} 
                color={option.color} 
                size="lg"
                className={`
                  ${selectedOption === index && isCorrect ? 'shape-correct' : ''}
                  ${selectedOption === index && isCorrect === false ? 'shape-incorrect' : ''}
                `}
              />
            </div>
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
        >
          New Pattern
        </Button>
      </div>
    </Card>
  );
};

export default FindNextShape;
