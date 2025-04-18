import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Shape {
  name: string;
  sides: number;
  vertices: number;
  image: string;
  description: string;
}

const shapes: Shape[] = [
  {
    name: "Triangle",
    sides: 3,
    vertices: 3,
    image: "🔺",
    description: "A shape with three sides and three corners"
  },
  {
    name: "Square",
    sides: 4,
    vertices: 4,
    image: "⬜",
    description: "A shape with four equal sides and four corners"
  },
  {
    name: "Rectangle",
    sides: 4,
    vertices: 4,
    image: " ▌",
    description: "A shape with four sides and four corners, where opposite sides are equal"
  },
  {
    name: "Circle",
    sides: 0,
    vertices: 0,
    image: "⭕",
    description: "A round shape with no corners or sides"
  },
  {
    name: "Pentagon",
    sides: 5,
    vertices: 5,
    image: "⬟",
    description: "A shape with five sides and five corners"
  },
  {
    name: "Hexagon",
    sides: 6,
    vertices: 6,
    image: "⬢",
    description: "A shape with six sides and six corners"
  }
];

interface ShapesOperationProps {
  onComplete: () => void;
}

const ShapesOperation: React.FC<ShapesOperationProps> = ({ onComplete }) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [showProperties, setShowProperties] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const currentShape = shapes[currentShapeIndex];
  
  useEffect(() => {
    speakInstruction(`This is a ${currentShape.name}. ${currentShape.description}`);
  }, [currentShapeIndex]);
  
  const handleNextShape = () => {
    if (currentShapeIndex < shapes.length - 1) {
      setCurrentShapeIndex(prev => prev + 1);
      setShowProperties(false);
    } else {
      setCompleted(true);
      onComplete();
    }
  };
  
  const speakInstruction = (text: string) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
   
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-end w-full mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => {

            const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState && 'speechSynthesis' in window) {
      // Stop current speech immediately
      window.speechSynthesis.cancel();
    }

          }}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="mb-8 text-center">
        <h3 className="text-xl font-medium text-muted-foreground mb-2">
          Learn about Shapes
        </h3>
        {showHint && (
          <p className="text-sm text-muted-foreground">
            Click "Show Properties" to learn more about this shape
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="text-[180px]"
        >
          {currentShape.image}
        </motion.div>
        
        <div className="text-2xl font-bold text-center">
          {currentShape.name}
        </div>
        
        {showProperties && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground">Description</h4>
                <p>{currentShape.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Properties</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Number of sides: {currentShape.sides}</li>
                  <li>Number of vertices: {currentShape.vertices}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          {completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowProperties(!showProperties)}
                className="bg-mathPurple bg-opacity-10 text-mathPurple hover:bg-mathPurple hover:text-white"
              >
                {showProperties ? "Hide Properties" : "Show Properties"}
              </Button>
              <Button onClick={handleNextShape}>
                Next Shape
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {shapes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentShapeIndex ? "bg-mathPurple" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShapesOperation; 