import AdditionPoster from '@/components/addVisual2/AdditionPoster';




const VisualTwo = ({firstNumber, secondNumber}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <AdditionPoster num1={firstNumber} num2={secondNumber} problem={`${firstNumber}+ ${secondNumber}`} />
      </div>
    </div>
  );
};

export default VisualTwo;
