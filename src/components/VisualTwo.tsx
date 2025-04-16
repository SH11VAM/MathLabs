import AdditionPoster from '@/components/addVisual2/AdditionPoster';




const VisualTwo = ({firstNumber, secondNumber}) => {
  return (
    <div className="lg:min-h-screen  lg:w-full bg-gradient-to-b from-zinc-100 to-slate-100 py-8 w-[45vh] ">
      <div className="container mx-auto px-4">
        <AdditionPoster num1={firstNumber} num2={secondNumber} problem={`${firstNumber}+ ${secondNumber}`} />
      </div>
    </div>
  );
};

export default VisualTwo;
