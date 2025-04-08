import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Plus, Minus, Divide, X, Hash, Square, Hash as Numbers } from 'lucide-react';
import AdditionOperation from '../operations/AdditionOperation';
import SubtractionOperation from '../operations/SubtractionOperation';
import MultiplicationOperation from '../operations/MultiplicationOperation';
import DivisionOperation from '../operations/DivisionOperation';
import FactorialOperation from '../operations/FactorialOperation';
import DecimalOperation from '../operations/DecimalOperation';
import CountingOperation from '../operations/CountingOperation';
import ShapesOperation from '../operations/ShapesOperation';
import NumbersOperation from '../operations/NumbersOperation';
import { toast } from "@/hooks/use-toast";

const Operation: React.FC = () => {
  const { operation, classLevel } = useParams<{ operation: string; classLevel: string }>();
  const navigate = useNavigate();
  const [problemNumber, setProblemNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleComplete = () => {
    setScore(prev => prev + 1);
    setProblemNumber(prev => prev + 1);
    
    if (problemNumber >= 5) {
      setShowScore(true);
      toast({
        title: "Great job!",
        description: `You completed ${problemNumber} problems with ${score} correct answers!`,
      });
    }
  };

  const handleNextProblem = () => {
    setProblemNumber(1);
    setScore(0);
    setShowScore(false);
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'addition':
        return <Plus className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'subtraction':
        return <Minus className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'multiplication':
        return <X className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'division':
        return <Divide className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'factorial':
        return <X className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'decimal':
        return <X className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'counting':
        return <Hash className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'shapes':
        return <Square className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'numbers':
        return <Numbers className="h-5 w-5 sm:h-6 sm:w-6" />;
      default:
        return null;
    }
  };

  const getColor = (operation: string) => {
    switch (operation) {
      case 'addition':
        return 'bg-mathBlue';
      case 'subtraction':
        return 'bg-mathGreen';
      case 'multiplication':
        return 'bg-mathPurple';
      case 'division':
        return 'bg-mathOrange';
      case 'factorial':
        return 'bg-mathPink';
      case 'decimal':
        return 'bg-mathYellow';
      case 'counting':
        return 'bg-mathTeal';
      case 'shapes':
        return 'bg-mathIndigo';
      case 'numbers':
        return 'bg-mathRed';
      default:
        return 'bg-mathBlue';
    }
  };

  const renderOperation = () => {
    switch (operation) {
      case 'addition':
        return <AdditionOperation key={problemNumber} onComplete={handleComplete} />;
      case 'subtraction':
        return <SubtractionOperation key={problemNumber} onComplete={handleComplete} />;
      case 'multiplication':
        return <MultiplicationOperation key={problemNumber} onComplete={handleComplete} />;
      case 'division':
        return <DivisionOperation key={problemNumber} onComplete={handleComplete} />;
      case 'factorial':
        return <FactorialOperation key={problemNumber} onComplete={handleComplete} />;
      case 'decimal':
        return <DecimalOperation key={problemNumber} onComplete={handleComplete} />;
      case 'counting':
        return <CountingOperation key={problemNumber} onComplete={handleComplete} />;
      case 'shapes':
        return <ShapesOperation key={problemNumber} onComplete={handleComplete} />;
      case 'numbers':
        return <NumbersOperation key={problemNumber} onComplete={handleComplete} />;
      default:
        return <AdditionOperation key={problemNumber} onComplete={handleComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col ">
     
      
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white ${getColor(operation || '')} bg-opacity-10`}>
              {getOperationIcon()}
            </div>
            <h1 className="heading-md sm:heading-lg capitalize ">
              {operation}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Problem {problemNumber}/5
            </div>
            <div className="text-sm font-medium">
              Score: {score}
            </div>
          </div>
        </div>

        {showScore ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Practice Complete!</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              You got {score} out of 5 problems correct!
            </p>
            <Button
              onClick={handleNextProblem}
              className="bg-mathBlue hover:bg-mathBlue/90 w-full sm:w-auto"
            >
              Try Again
            </Button>
          </motion.div>
        ) : (
          <div className="responsive-container">
            {renderOperation()}
          </div>
        )}
      </main>
    </div>
  );
};

export default Operation;
