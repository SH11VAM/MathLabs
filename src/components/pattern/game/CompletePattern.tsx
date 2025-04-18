
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Shape, { ShapeType, ShapeColor } from '@/components/pattern/shapes/Shape';
import { PatternItem } from '@/components/pattern/patterns/Pattern';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const shapeTypes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond'];
const shapeColors: ShapeColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

interface CompletePatterProps {
  level?: number;
  onComplete?: () => void;
}

const CompletePattern: React.FC<CompletePatterProps> = ({ 
  level = 1,
  onComplete
}) => {
  const [pattern, setPattern] = useState<(PatternItem | null)[]>([]);
  const [options, setOptions] = useState<PatternItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gapIndex, setGapIndex] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  // Generate a new pattern based on the level
  const generatePattern = () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setHintUsed(false);
    
    // Adjust pattern complexity based on level
    const patternLength = Math.min(5 + Math.floor(level / 2), 9);
    
    // Create a pattern with increasing complexity based on level
    let newPattern: PatternItem[] = [];
    
    // Level 1-2: simple alternating (A-B-A-B)
    // Level 3-4: 3-item pattern (A-B-C-A-B-C)
    // Level 5+: more complex patterns
    const repeatLength = level <= 2 ? 2 : level <= 4 ? 3 : Math.min(4, level - 1);
    const patternBase: PatternItem[] = [];
    
    for (let i = 0; i < repeatLength; i++) {
      // Higher levels may have both color and shape patterns
      const useComplexPatterns = level > 3;
      
      let randomType: ShapeType;
      let randomColor: ShapeColor;
      
      if (useComplexPatterns && i > 0) {
        // For complex patterns, we might reuse previous shapes/colors
        // to create more interesting patterns
        const prevItem = patternBase[i-1];
        
        if (Math.random() > 0.5) {
          // Same color, different shape
          randomColor = prevItem.color;
          do {
            randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          } while (randomType === prevItem.type);
        } else {
          // Same shape, different color
          randomType = prevItem.type;
          do {
            randomColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
          } while (randomColor === prevItem.color);
        }
      } else {
        // Completely random item
        randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        randomColor = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      }
      
      patternBase.push({ type: randomType, color: randomColor });
    }
    
    // Repeat the pattern
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(patternBase[i % repeatLength]);
    }
    
    // Choose a random position to remove (create a gap)
    const randomGapIndex = Math.floor(Math.random() * patternLength);
    setGapIndex(randomGapIndex);
    
    // Convert to pattern with gap
    const patternWithGap = [...newPattern];
    const correctAnswer = patternWithGap[randomGapIndex];
    patternWithGap[randomGapIndex] = null;
    setPattern(patternWithGap);
    
    // Generate options (correct + 3 distractors)
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
    
    // Create full pattern with selected option
    const fullPattern = [...pattern];
    fullPattern[gapIndex] = options[index];
    
    // Check if the pattern is correct
    const repeatLength = level <= 2 ? 2 : level <= 4 ? 3 : Math.min(4, level - 1);
    
    // Extract the base pattern
    const base: PatternItem[] = [];
    for (let i = 0; i < repeatLength; i++) {
      const itemIndex = (gapIndex - (gapIndex % repeatLength) + i) % fullPattern.length;
      base.push(fullPattern[itemIndex] as PatternItem);
    }
    
    // Check if each item follows the pattern
    let isAnswerCorrect = true;
    for (let i = 0; i < fullPattern.length; i++) {
      const expectedItem = base[i % repeatLength];
      const actualItem = fullPattern[i];
      
      if (!isPatternItemEqual(expectedItem, actualItem as PatternItem)) {
        isAnswerCorrect = false;
        break;
      }
    }
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      toast.success("Perfect! You completed the pattern!");
      // Add points based on hint usage
      const points = hintUsed ? 1 : 2;
      setScore(prev => prev + points);
      
      // Wait a bit before generating a new pattern
      setTimeout(() => {
        generatePattern();
      }, 1500);
    } else {
      toast.error("That doesn't complete the pattern. Try again!");
    }
  };
  
  // Show hint
  const showHint = () => {
    setHintUsed(true);
    
    const repeatLength = level <= 2 ? 2 : level <= 4 ? 3 : Math.min(4, level - 1);
    
    // Extract the base pattern
    const base: PatternItem[] = [];
    for (let i = 0; i < repeatLength; i++) {
      const itemIndex = (gapIndex - (gapIndex % repeatLength) + i) % pattern.length;
      if (pattern[itemIndex] !== null) {
        base.push(pattern[itemIndex] as PatternItem);
      }
    }
    
    toast.info("Look for the repeating pattern!", {
      description: `This pattern repeats every ${repeatLength} shapes.`
    });
  };
  
  // Generate initial pattern on mount
  useEffect(() => {
    generatePattern();
  }, [level]);
  
  return (
    <Card className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Complete the Pattern</h2>
        <p className="text-gray-500 mb-4">Fill in the missing shape to complete the pattern</p>
        <div className="flex justify-center items-center gap-2">
          <span className="font-semibold">Score: {score}</span>
          <Separator orientation="vertical" className="h-6" />
          <span className="font-semibold">Level: {level}</span>
        </div>
      </div>
      
      <div className="bg-purple-50 p-6 rounded-xl mb-8 flex flex-wrap justify-center gap-4">
        {pattern.map((item, index) => (
          <div key={index} className="relative">
            {item ? (
              <Shape 
                type={item.type} 
                color={item.color} 
                size="lg" 
              />
            ) : (
              <div className="w-16 h-16 rounded-md border-4 border-dashed border-purple-300 flex items-center justify-center">
                <span className="text-2xl text-purple-300">?</span>
              </div>
            )}
            {selectedOption !== null && gapIndex === index && (
              <Shape 
                type={options[selectedOption].type} 
                color={options[selectedOption].color} 
                size="lg"
                className={`absolute top-0 left-0 ${isCorrect ? 'shape-correct' : 'shape-incorrect'}`}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Choose the missing shape:</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {options.map((option, index) => (
            <div
              key={index}
              className={`
                cursor-pointer p-4 rounded-xl flex justify-center items-center border-2 transition-all
                ${selectedOption === index && isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${selectedOption === index && isCorrect === false ? 'border-red-500 bg-red-50' : ''}
                ${selectedOption !== index && selectedOption !== null ? 'opacity-50' : ''}
                ${selectedOption === null ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50' : ''}
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <Shape 
                type={option.type} 
                color={option.color} 
                size="lg" 
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
          className="bg-purple-600 hover:bg-purple-700"
        >
          New Pattern
        </Button>
      </div>
    </Card>
  );
};

export default CompletePattern;
