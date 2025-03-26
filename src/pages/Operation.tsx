
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MathHeader from '../components/MathHeader';
import AdditionOperation from '../operations/AdditionOperation';
import SubtractionOperation from '../operations/SubtractionOperation';
import MultiplicationOperation from '../operations/MultiplicationOperation';
import DivisionOperation from '../operations/DivisionOperation';
import StarReward from '../components/StarReward';

const Operation = () => {
  const { operation } = useParams<{ operation: string }>();
  const navigate = useNavigate();
  const [showStars, setShowStars] = useState(false);
  const [problemNumber, setProblemNumber] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  
  useEffect(() => {
    // Reset problem when operation changes
    setProblemNumber(prev => prev + 1);
  }, [operation]);
  
  const handleComplete = () => {
    setShowStars(true);
    setTimeout(() => {
      setShowStars(false);
    }, 3000);
  };
  
  const handleNewProblem = () => {
    setProblemNumber(prev => prev + 1);
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const getTitle = () => {
    switch (operation) {
      case 'addition':
        return 'Addition';
      case 'subtraction':
        return 'Subtraction';
      case 'multiplication':
        return 'Multiplication';
      case 'division':
        return 'Division';
      default:
        return 'Math';
    }
  };
  
  const getColor = () => {
    switch (operation) {
      case 'addition':
        return 'text-mathBlue';
      case 'subtraction':
        return 'text-mathPink';
      case 'multiplication':
        return 'text-mathPurple';
      case 'division':
        return 'text-mathGreen';
      default:
        return 'text-foreground';
    }
  };
  
  const renderOperation = () => {
    switch (operation) {
      case 'addition':
        return <AdditionOperation key={problemNumber} onComplete={handleComplete} difficulty={difficulty} />;
      case 'subtraction':
        return <SubtractionOperation key={problemNumber} onComplete={handleComplete} difficulty={difficulty} />;
      case 'multiplication':
        return <MultiplicationOperation key={problemNumber} onComplete={handleComplete} difficulty={difficulty} />;
      case 'division':
        return <DivisionOperation key={problemNumber} onComplete={handleComplete} difficulty={difficulty} />;
      default:
        return <div>Operation not found</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MathHeader />
      
      <StarReward show={showStars} />
      
      <main className="flex-1 px-6 py-8 md:px-12 md:py-10 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-muted" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className={`heading-lg ${getColor()}`}>{getTitle()}</h1>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-muted" 
            onClick={handleNewProblem}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        
        <motion.div
          key={problemNumber}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="math-card mx-auto max-w-4xl"
        >
          {renderOperation()}
        </motion.div>
        
        <div className="mt-6 flex justify-center">
          <div className="rounded-full bg-white shadow-sm p-2 flex gap-2">
            <Button 
              variant={difficulty === 'easy' ? 'default' : 'outline'} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </Button>
            <Button 
              variant={difficulty === 'medium' ? 'default' : 'outline'} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </Button>
            <Button 
              variant={difficulty === 'hard' ? 'default' : 'outline'} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Operation;
