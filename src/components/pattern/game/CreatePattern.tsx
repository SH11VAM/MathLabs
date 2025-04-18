import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Shape, { ShapeType, ShapeColor } from '@/components/pattern/shapes/Shape';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const shapeTypes: ShapeType[] = ['circle', 'square', 'triangle', 'diamond'];
const shapeColors: ShapeColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

interface CreatePatternProps {
  onComplete?: () => void;
}

const CreatePattern: React.FC<CreatePatternProps> = ({ onComplete }) => {
  const [palette, setPalette] = useState<Array<{type: ShapeType, color: ShapeColor}>>([]);
  const [selectedShape, setSelectedShape] = useState<{type: ShapeType, color: ShapeColor} | null>(null);
  const [userPattern, setUserPattern] = useState<Array<{type: ShapeType, color: ShapeColor}>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(-1);

  // Initialize the palette
  useEffect(() => {
    const newPalette: Array<{type: ShapeType, color: ShapeColor}> = [];
    
    // Create a diverse palette
    for (const type of shapeTypes) {
      for (const color of shapeColors) {
        // Only add some combinations to keep the palette manageable
        if ((type === 'circle' && ['red', 'blue', 'green', 'yellow'].includes(color)) ||
            (type === 'square' && ['red', 'blue', 'purple', 'orange'].includes(color)) ||
            (type === 'triangle' && ['green', 'yellow', 'purple', 'orange'].includes(color)) ||
            (type === 'diamond' && ['blue', 'green', 'red', 'yellow'].includes(color))) {
          newPalette.push({ type, color });
        }
      }
    }
    
    // Shuffle the palette
    for (let i = newPalette.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPalette[i], newPalette[j]] = [newPalette[j], newPalette[i]];
    }
    
    setPalette(newPalette);
  }, []);

  // Add a shape to the pattern
  const addShapeToPattern = (shape: {type: ShapeType, color: ShapeColor}) => {
    if (userPattern.length < 12) {
      setUserPattern([...userPattern, shape]);
      setSelectedShape(shape);
    } else {
      toast.warning("Your pattern is getting quite long! You can clear it and start over.");
    }
  };

  // Remove the last shape from the pattern
  const removeLastShape = () => {
    if (userPattern.length > 0) {
      setUserPattern(userPattern.slice(0, -1));
    }
  };

  // Clear the pattern
  const clearPattern = () => {
    setUserPattern([]);
    setIsPlaying(false);
    setPlaybackIndex(-1);
  };

  // Play the pattern animation
  const playPattern = () => {
    if (userPattern.length === 0) {
      toast.info("Create a pattern first!");
      return;
    }
    
    setIsPlaying(true);
    setPlaybackIndex(-1);
    
    // Analyze pattern
    analyzePattern();
    
    // Animate through the pattern
    let index = 0;
    const interval = setInterval(() => {
      if (index < userPattern.length) {
        setPlaybackIndex(index);
        index++;
      } else {
        // Loop the animation
        index = 0;
      }
    }, 600);
    
    // Stop after a few iterations
    setTimeout(() => {
      clearInterval(interval);
      setIsPlaying(false);
      setPlaybackIndex(-1);
    }, 8000);
  };

  // Analyze the pattern and provide feedback
  const analyzePattern = () => {
    if (userPattern.length < 4) {
      toast.info("Add more shapes to create a pattern!");
      return;
    }
    
    // Check for repeating patterns
    const patternTypes = detectPatternType();
    
    // Provide feedback based on pattern type
    if (patternTypes.repeatingPattern) {
      const repeatLength = patternTypes.repeatLength || 0;
      toast.success(`Great job! You created a repeating pattern!`, {
        description: `Your pattern repeats every ${repeatLength} shape${repeatLength > 1 ? 's' : ''}.`
      });
    } else if (patternTypes.alternatingColors) {
      toast.success("Nice color pattern! You're alternating colors.");
    } else if (patternTypes.alternatingShapes) {
      toast.success("Cool shape pattern! You're alternating shapes.");
    } else if (patternTypes.sameShapes) {
      toast.info("Interesting! You're using the same shape with different colors.");
    } else if (patternTypes.sameColors) {
      toast.info("Creative! You're using the same color with different shapes.");
    } else {
      toast.info("What an interesting pattern! Can you explain your pattern to someone?");
    }
  };

  // Detect what type of pattern the user has created
  const detectPatternType = () => {
    const patternTypes = {
      repeatingPattern: false,
      repeatLength: 0,
      alternatingColors: false,
      alternatingShapes: false,
      sameColors: true,
      sameShapes: true
    };
    
    // Check if all shapes are the same
    const firstShape = userPattern[0];
    for (let i = 1; i < userPattern.length; i++) {
      if (userPattern[i].type !== firstShape.type) {
        patternTypes.sameShapes = false;
      }
      if (userPattern[i].color !== firstShape.color) {
        patternTypes.sameColors = false;
      }
    }
    
    // Check for alternating pattern (AB AB...)
    if (userPattern.length >= 4) {
      let isAlternatingShape = true;
      let isAlternatingColor = true;
      
      for (let i = 2; i < userPattern.length; i++) {
        if (userPattern[i].type !== userPattern[i % 2].type) {
          isAlternatingShape = false;
        }
        if (userPattern[i].color !== userPattern[i % 2].color) {
          isAlternatingColor = false;
        }
      }
      
      patternTypes.alternatingShapes = isAlternatingShape && !patternTypes.sameShapes;
      patternTypes.alternatingColors = isAlternatingColor && !patternTypes.sameColors;
    }
    
    // Check for repeating pattern of any length
    if (userPattern.length >= 6) {
      // Try different repeat lengths
      for (let repeatLength = 2; repeatLength <= Math.floor(userPattern.length / 2); repeatLength++) {
        let isRepeating = true;
        
        for (let i = repeatLength; i < userPattern.length; i++) {
          const current = userPattern[i];
          const patternItem = userPattern[i % repeatLength];
          
          if (current.type !== patternItem.type || current.color !== patternItem.color) {
            isRepeating = false;
            break;
          }
        }
        
        if (isRepeating) {
          patternTypes.repeatingPattern = true;
          patternTypes.repeatLength = repeatLength;
          break;
        }
      }
    }
    
    return patternTypes;
  };

  return (
    <Card className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Your Own Pattern</h2>
        <p className="text-gray-500">Select shapes and colors to make your own pattern!</p>
      </div>
      
      <div className="bg-yellow-50 p-6 rounded-xl mb-8">
        <div className="min-h-24 flex flex-wrap items-center justify-center gap-3 mb-4 border-2 border-dashed border-yellow-300 rounded-lg p-4">
          {userPattern.length === 0 ? (
            <p className="text-yellow-500 italic">Click on shapes below to add them to your pattern</p>
          ) : (
            userPattern.map((shape, index) => (
              <Shape 
                key={index}
                type={shape.type}
                color={shape.color}
                size="lg"
                animate={playbackIndex === index}
                className={playbackIndex === index ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
              />
            ))
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 my-4">
          {palette.map((shape, index) => (
            <div 
              key={index}
              className={`cursor-pointer p-2 rounded-lg transition-all hover:bg-yellow-100 ${
                selectedShape?.type === shape.type && selectedShape?.color === shape.color 
                  ? 'bg-yellow-100 ring-2 ring-yellow-400' 
                  : ''
              }`}
              onClick={() => addShapeToPattern(shape)}
            >
              <Shape 
                type={shape.type}
                color={shape.color}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          onClick={removeLastShape}
          disabled={userPattern.length === 0 || isPlaying}
        >
          Remove Last
        </Button>
        <Button
          variant="outline"
          onClick={clearPattern}
          disabled={userPattern.length === 0 || isPlaying}
        >
          Clear All
        </Button>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600"
          onClick={playPattern}
          disabled={userPattern.length < 3 || isPlaying}
        >
          {isPlaying ? "Playing..." : "Play Pattern"}
        </Button>
      </div>
    </Card>
  );
};

export default CreatePattern;
