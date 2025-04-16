
import React, { useState, useEffect } from 'react';
import PlaceValueBlocks from './PlaceValueBlocks';
import OwlTeacher from './OwlTeacher';
import Chalkboard from './Chalkboard';
import AnimalStudents from './AnimalStudents';
import { Button } from '@/components/ui/button';

interface AdditionPosterProps {
  num1: number;
  num2: number;
  problem?: string;
}

const AdditionPoster: React.FC<AdditionPosterProps> = ({ 
  num1 = 34, 
  num2 = 25, 
  problem = "34 + 25" 
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Calculate tens and ones for each number
  const num1Tens = Math.floor(num1 / 10);
  const num1Ones = num1 % 10;
  const num2Tens = Math.floor(num2 / 10);
  const num2Ones = num2 % 10;
  
  // Calculate the answer
  const answer = num1 + num2;

  useEffect(() => {
    if (showAnswer) {
      const timer = setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowExplanation(false);
    }
  }, [showAnswer]);

  return (
    <div className="lg:w-full lg:max-w-4xl mx-auto lg:p-4 w-[40vh]">
      <div className="bg-kid-classroom rounded-3xl p-6 shadow-lg border-8 border-kid-yellow">
        <h1 className="text-center font-marker text-3xl md:text-5xl text-kid-purple mb-6">
          Place Value Addition
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="font-marker text-2xl text-kid-blue mb-4">First Number: {num1}</h2>
            <PlaceValueBlocks tens={num1Tens} ones={num1Ones} />
            
            <div className="mt-4 text-center">
              <p className="font-comic text-lg">
                <span className="text-kid-blue font-bold">{num1Tens} tens</span> + <span className="text-kid-red font-bold">{num1Ones} ones</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="font-marker text-2xl text-kid-green mb-4">Second Number: {num2}</h2>
            <PlaceValueBlocks tens={num2Tens} ones={num2Ones} />
            
            <div className="mt-4 text-center">
              <p className="font-comic text-lg">
                <span className="text-kid-blue font-bold">{num2Tens} tens</span> + <span className="text-kid-red font-bold">{num2Ones} ones</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
          <OwlTeacher showSpeechBubble={!showAnswer} />
          
          <Chalkboard 
            problem={problem} 
            answer={answer} 
            showAnswer={showAnswer} 
          />
        </div>
        
        {showExplanation && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 animate-bounce-in">
            <h3 className="font-marker text-xl text-kid-purple mb-2">How We Solved It:</h3>
            <p className="font-comic text-lg">
              <span className="text-kid-blue font-bold">{num1Tens} tens</span> + <span className="text-kid-blue font-bold">{num2Tens} tens</span> = <span className="text-kid-blue font-bold">{num1Tens + num2Tens} tens</span>
            </p>
            <p className="font-comic text-lg">
              <span className="text-kid-red font-bold">{num1Ones} ones</span> + <span className="text-kid-red font-bold">{num2Ones} ones</span> = <span className="text-kid-red font-bold">{num1Ones + num2Ones} ones</span>
            </p>
            <p className="font-comic text-lg font-bold mt-2">
              {num1Tens + num2Tens} tens + {num1Ones + num2Ones} ones = {answer}
            </p>
          </div>
        )}
        
        <div className="flex justify-center mb-4">
          <Button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-kid-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-lg transition-all transform hover:scale-105"
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
        </div>
        
        <AnimalStudents />
      </div>
    </div>
  );
};

export default AdditionPoster;
