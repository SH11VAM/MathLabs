
import React from 'react';
import { Calculator, Book, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MathHeader: React.FC = () => {
  return (
    <header className="px-4 py-3 rounded-b-3xl bg-white shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-mathPink bg-opacity-10 p-2 rounded-full">
          <Calculator className="h-6 w-6 text-mathPink" />
        </div>
        <h1 className="text-xl font-bold text-foreground font-display">FunMath</h1>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Book className="h-5 w-5 text-mathPurple" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Award className="h-5 w-5 text-mathYellow" />
        </Button>
      </div>
    </header>
  );
};

export default MathHeader;
