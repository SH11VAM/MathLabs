
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  image: React.ReactNode;
  fraction: string;
  numeratorQuestion: string;
  denominatorQuestion: string;
  correctNumerator: number;
  correctDenominator: number;
}

const InteractiveFractions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedNumerator, setSelectedNumerator] = useState<number | null>(null);
  const [selectedDenominator, setSelectedDenominator] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);
  
  // Example shapes for questions
  const CircleThirds = () => (
    <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-800">
      <div className="absolute inset-0 bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-kid-purple" />
        <div className="absolute top-0 left-1/3 w-1/3 h-full bg-white border-l-2 border-r-2 border-gray-800" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white" />
      </div>
    </div>
  );
  
  const SquareFourths = () => (
    <div className="grid grid-cols-2 grid-rows-2 w-36 h-36 border-2 border-gray-800">
      <div className="bg-kid-green border-r border-b border-gray-800"></div>
      <div className="bg-white border-b border-gray-800"></div>
      <div className="bg-white border-r border-gray-800"></div>
      <div className="bg-white"></div>
    </div>
  );
  
  const RectangleFifths = () => (
    <div className="flex w-48 h-24 border-2 border-gray-800">
      <div className="w-1/5 h-full bg-kid-blue border-r border-gray-800"></div>
      <div className="w-1/5 h-full bg-kid-blue border-r border-gray-800"></div>
      <div className="w-1/5 h-full bg-white border-r border-gray-800"></div>
      <div className="w-1/5 h-full bg-white border-r border-gray-800"></div>
      <div className="w-1/5 h-full bg-white"></div>
    </div>
  );
  
  const questions: Question[] = [
    {
      id: 1,
      image: <CircleThirds />,
      fraction: "?/?",
      numeratorQuestion: "How many parts are colored purple?",
      denominatorQuestion: "How many total equal parts are there?",
      correctNumerator: 1,
      correctDenominator: 3
    },
    {
      id: 2,
      image: <SquareFourths />,
      fraction: "?/?",
      numeratorQuestion: "How many parts are colored green?",
      denominatorQuestion: "How many total equal parts are there?",
      correctNumerator: 1,
      correctDenominator: 4
    },
    {
      id: 3,
      image: <RectangleFifths />,
      fraction: "?/?",
      numeratorQuestion: "How many parts are colored blue?",
      denominatorQuestion: "How many total equal parts are there?",
      correctNumerator: 2,
      correctDenominator: 5
    }
  ];
  
  const checkAnswer = () => {
    if (selectedNumerator === null || selectedDenominator === null) {
      toast({
        title: "Oops!",
        description: "Please select both a numerator and denominator.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChecking(true);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = 
      selectedNumerator === currentQ.correctNumerator && 
      selectedDenominator === currentQ.correctDenominator;
    
    if (isCorrect) {
      toast({
        title: "Correct! 🎉",
        description: `That's right! ${selectedNumerator}/${selectedDenominator} is the correct fraction.`,
        variant: "default"
      });
      setScore(score + 1);
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is ${currentQ.correctNumerator}/${currentQ.correctDenominator}. Let's try another!`,
        variant: "default"
      });
    }
    
    // Move to next question or reset
    setTimeout(() => {
      setIsChecking(false);
      setSelectedNumerator(null);
      setSelectedDenominator(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // End of questions
        toast({
          title: "Great job!",
          description: `You scored ${score + (isCorrect ? 1 : 0)} out of ${questions.length}. Let's start again!`,
          variant: "default"
        });
        setCurrentQuestion(0);
        setScore(0);
      }
    }, 2000);
  };
  
  const question = questions[currentQuestion];
  
  return (
    <div className="bg-kid-pink rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-white mb-6">
        Let's Practice!
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center"
          >
            {/* Shape image */}
            {question.image}
            
            {/* Fraction display */}
            <motion.div 
              className="mt-6 text-4xl font-bold flex items-center"
              animate={isChecking ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1 }}
            >
              <span className={`${selectedNumerator !== null ? 'text-kid-red' : 'text-gray-400'}`}>
                {selectedNumerator !== null ? selectedNumerator : '?'}
              </span>
              <span className="mx-1">/</span>
              <span className={`${selectedDenominator !== null ? 'text-kid-blue' : 'text-gray-400'}`}>
                {selectedDenominator !== null ? selectedDenominator : '?'}
              </span>
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-kid-red">
                {question.numeratorQuestion}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <Button
                    key={`num-${num}`}
                    onClick={() => setSelectedNumerator(num)}
                    variant={selectedNumerator === num ? "default" : "outline"}
                    className={`w-12 h-12 text-xl ${selectedNumerator === num ? 'bg-kid-red hover:bg-red-600' : ''}`}
                    disabled={isChecking}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-kid-blue">
                {question.denominatorQuestion}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6].map(num => (
                  <Button
                    key={`denom-${num}`}
                    onClick={() => setSelectedDenominator(num)}
                    variant={selectedDenominator === num ? "default" : "outline"}
                    className={`w-12 h-12 text-xl ${selectedDenominator === num ? 'bg-kid-blue hover:bg-blue-600' : ''}`}
                    disabled={isChecking}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              onClick={checkAnswer}
              disabled={isChecking || selectedNumerator === null || selectedDenominator === null}
              className="w-full py-6 text-xl bg-kid-green hover:bg-green-600"
            >
              {isChecking ? "Checking..." : "Check My Answer!"}
            </Button>
            
            <div className="mt-4 text-right">
              <span className="font-bold">Score: {score}/{questions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFractions;
