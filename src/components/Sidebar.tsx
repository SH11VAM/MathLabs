import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Operation {
  name: string;
  path: string;
  icon: string;
}

interface ClassOperations {
  [key: string]: Operation[];
}

const classOperations: ClassOperations = {
  "Class 1": [
    { name: "Addition", path: "/addition/1", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/1", icon: "➖" },
    { name: "Counting", path: "/counting/1", icon: "🔢" },
    { name: "Numbers", path: "/numbers/1", icon: "🔢" },
  ],
  "Class 2": [
    { name: "Addition", path: "/addition/2", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/2", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/2", icon: "✖️" },
    { name: "Shapes", path: "/shapes/2", icon: "🔷" },
  ],
  "Class 3": [
    { name: "Addition", path: "/addition/3", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/3", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/3", icon: "✖️" },
    { name: "Division", path: "/division/3", icon: "➗" },
  ],
  "Class 4": [
    { name: "Addition", path: "/addition/4", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/4", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/4", icon: "✖️" },
    { name: "Division", path: "/division/4", icon: "➗" },
    { name: "Factorial", path: "/factorial/4", icon: "!" },
  ],
  "Class 5": [
    { name: "Addition", path: "/addition/5", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/5", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/5", icon: "✖️" },
    { name: "Division", path: "/division/5", icon: "➗" },
    { name: "Factorial", path: "/factorial/5", icon: "!" },
    { name: "Decimal", path: "/decimal/5", icon: "🔢" },
  ],
  "Class 6": [
    { name: "Addition", path: "/addition/6", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/6", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/6", icon: "✖️" },
    { name: "Division", path: "/division/6", icon: "➗" },
    { name: "Factorial", path: "/factorial/6", icon: "!" },
    { name: "Decimal", path: "/decimal/6", icon: "🔢" },
  ],
  "Class 7": [
    { name: "Addition", path: "/addition/7", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/7", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/7", icon: "✖️" },
    { name: "Division", path: "/division/7", icon: "➗" },
    { name: "Factorial", path: "/factorial/7", icon: "!" },
    { name: "Decimal", path: "/decimal/7", icon: "🔢" },
  ],
  "Class 8": [
    { name: "Addition", path: "/addition/8", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/8", icon: "➖" },
    { name: "Multiplication", path: "/multiplication/8", icon: "✖️" },
    { name: "Division", path: "/division/8", icon: "➗" },
    { name: "Factorial", path: "/factorial/8", icon: "!" },
    { name: "Decimal", path: "/decimal/8", icon: "🔢" },
  ],
};

const Sidebar: React.FC = () => {
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleClass = (className: string) => {
    setExpandedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleOperationClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 h-screen overflow-y-auto bg-white p-4 shadow-lg scroll-smooth scrollbar">
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/YoungLabsLogofan.png"
            alt="YoungLabs Logo"
            width={50}
            height={50}
            className="animate-[spin_1.5s_linear_infinite]"
          />
          <h2 className="text-xl font-bold text-animate text-[#55D400] bg-clip-text text-transparent bg-gradient-to-r from-mathBlue to-mathPurple">MathLabs</h2>
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(classOperations).map(([className, operations]) => (
          <div key={className}>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => toggleClass(className)}
            >
              {className}
              {expandedClasses.includes(className) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            {expandedClasses.includes(className) && (
              <div className="ml-4 space-y-1">
                {operations.map((operation) => (
                  <Button
                    key={operation.path}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleOperationClick(operation.path)}
                  >
                    <span className="mr-2">{operation.icon}</span>
                    {operation.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
