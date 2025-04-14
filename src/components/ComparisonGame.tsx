import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import NumberLine from './NumberLine';
import CrocMouth from './CrocMouth';
import TrainAnimation from './TrainAnimation';
import RacingAnimals from './RacingAnimals';
import FireworkAnimation from './FireworkAnimation';

interface Question {
  num1: number;
  num2: number;
  maxValue?: number; // Optional maximum value for the number line
}

const ComparisonGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    // Single-digit questions
    { num1: 4, num2: 2, maxValue: 10 },
    { num1: 7, num2: 9, maxValue: 10 },
    { num1: 5, num2: 5, maxValue: 10 },
    { num1: 1, num2: 8, maxValue: 10 },
    // Two-digit questions
    { num1: 12, num2: 21, maxValue: 30 },
    { num1: 25, num2: 18, maxValue: 30 },
    { num1: 15, num2: 15, maxValue: 30 },
    { num1: 29, num2: 11, maxValue: 30 }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'<' | '>' | '='>();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showTrain, setShowTrain] = useState(false);
  const [showRacing, setShowRacing] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  
  const question = questions[currentQuestion];
  const maxValue = question.maxValue || Math.max(question.num1, question.num2, 10);
  
  useEffect(() => {
    setSelectedAnswer(undefined);
    setIsCorrect(null);
    setShowResult(false);
    setShowTrain(false);
    setShowRacing(false);
  }, [currentQuestion]);
  
  const checkAnswer = () => {
    if (!selectedAnswer) return;
    
    let correct = false;
    if (selectedAnswer === '<' && question.num1 < question.num2) correct = true;
    if (selectedAnswer === '>' && question.num1 > question.num2) correct = true;
    if (selectedAnswer === '=' && question.num1 === question.num2) correct = true;
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
      toast.success("Great job! That's correct! 🎉", {
        position: "top-center",
      });
    } else {
      toast.error("Oops! Let's try again. 💪", {
        position: "top-center",
      });
    }
    
    setShowResult(true);
    
    setTimeout(() => setShowTrain(true), 1000);
    setTimeout(() => setShowRacing(true), 2000);
  };
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
      setShowFireworks(true);
      
      toast.success(`You scored ${score + (isCorrect ? 1 : 0)} out of ${questions.length}!`, {
        position: "top-center",
        duration: 5000,
      });
      
      setTimeout(() => {
        setShowFireworks(false);
      }, 7000);
    }
  };
  
  const resetGame = () => {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setCompleted(false);
    setShowFireworks(false);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <FireworkAnimation show={showFireworks} />
      
      {!completed ? (
        <>
          <div className="mb-6 text-center">
            <div className="text-lg font-medium mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="flex justify-center items-center text-3xl font-bold gap-4">
              <span className={`bg-magic-yellow px-4 py-2 rounded-lg ${question.num1 >= 10 ? 'text-2xl' : 'text-3xl'}`}>{question.num1}</span>
              <span className="w-12 h-12 border-2 border-magic-purple rounded-lg flex items-center justify-center">
                {selectedAnswer || '?'}
              </span>
              <span className={`bg-magic-pink px-4 py-2 rounded-lg ${question.num2 >= 10 ? 'text-2xl' : 'text-3xl'}`}>{question.num2}</span>
            </div>
          </div>
          
          <NumberLine 
            min={0} 
            max={maxValue} 
            highlightNumbers={[question.num1, question.num2]} 
          />
          
          {showResult && (
            <CrocMouth 
              number1={question.num1} 
              number2={question.num2} 
              showResult={showResult} 
            />
          )}
          
          {showTrain && (
            <>
              <h3 className="text-xl font-bold text-center mt-6 mb-2">
                Watch the number train! 🚂
              </h3>
              <TrainAnimation 
                number={question.num1} 
                maxNumber={maxValue} 
                isMoving={showTrain} 
              />
              <TrainAnimation 
                number={question.num2} 
                maxNumber={maxValue} 
                isMoving={showTrain} 
              />
            </>
          )}
          
          {showRacing && (
            <>
              <h3 className="text-xl font-bold text-center mt-6 mb-2">
                Racing animals! Who will win? 🏁
              </h3>
              <RacingAnimals 
                number1={question.num1} 
                number2={question.num2} 
                maxNumber={maxValue} 
                isRacing={showRacing} 
              />
            </>
          )}
          
          <div className="flex justify-center space-x-6 my-6">
            {!showResult ? (
              <>
                <Button 
                  className={`bg-magic-blue/20 border-2 border-magic-blue  text-magic-blue hover:text-white text-xl h-14 w-14 rounded-full font-extrabold ${selectedAnswer === '<' ? 'ring-4 ring-magic-purple' : ''}`}
                  onClick={() => setSelectedAnswer('<')}
                >
                  &lt;
                </Button>
                <Button 
                  className={`hover:bg-magic-green border-2 border-magic-green bg-magic-green/20 text-magic-green font-extrabold hover:text-white text-xl h-14 w-14 rounded-full ${selectedAnswer === '=' ? 'ring-4 ring-magic-purple' : ''}`}
                  onClick={() => setSelectedAnswer('=')}
                >
                  =
                </Button>
                <Button 
                  className={`hover:bg-magic-orange text-magic-orange border-2 border-magic-orange font-extrabold bg-magic-orange/20 hover:text-white text-xl h-14 w-14 rounded-full ${selectedAnswer === '>' ? 'ring-4 ring-magic-purple' : ''}`}
                  onClick={() => setSelectedAnswer('>')}
                >
                  &gt;
                </Button>
              </>
            ) : (
              <Button 
                className="bg-magic-purple hover:bg-magic-purple/80 text-white px-8 py-2 rounded-full text-lg animate-bounce-horizontal"
                onClick={nextQuestion}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </div>
          
          {!showResult && (
            <div className="flex justify-center my-4">
              <Button 
                className="hover:bg-magic-red border-2 border-magic-red text-magic-red font-extrabold bg-magic-red/20 hover:text-white px-6 py-2 rounded-full disabled:opacity-50"
                onClick={checkAnswer}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Great Job! 🎉</h2>
          <p className="text-xl mb-6">
            You scored <span className="text-magic-purple font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>!
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-magic-purple hover:bg-magic-purple/80 text-white px-8 py-3 text-lg rounded-full animate-bounce-horizontal"
              onClick={resetGame}
            >
              Play Again
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-magic-light-purple/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2">✨ Fun Fact! ✨</h3>
            <p className="text-lg">
              A number line helps you "see" the value of numbers — it's like a ruler for your brain! 
              The further right you go, the bigger the number gets! Even with two-digit numbers! 📏💡
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonGame;
