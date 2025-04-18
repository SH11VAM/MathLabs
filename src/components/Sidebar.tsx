import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, X } from "lucide-react";

interface Operation {
  name: string;
  path: string;
  icon: string;
}

interface ClassOperations {
  [key: string]: Operation[];
}

interface SidebarProps {
  selectedClass?: string;
  selectedOperation?: string;
  onClose?: () => void;
 
}

const classOperations: ClassOperations = {
  "Class 1": [
    { name: "Addition", path: "/addition/1", icon: "➕" },
    { name: "Subtraction", path: "/subtraction/1", icon: "➖" },
    { name: "Counting", path: "/counting/1", icon: "🔢" },
    { name: "Numbers", path: "/numbers/1", icon: "📏" },
    { name: "MCQ", path: "/MCQ", icon:"✏️" },

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
    { name: "Fraction", path: "/fraction/3", icon: "🌗" },
    {name:"Pattern", path:"/pattern/3", icon:"🧩"},
  ],
  "Class 4": [
    { name: "Addition", path: "/addition/4", icon: "➕" },
    // { name: "Subtraction", path: "/subtraction/4", icon: "➖" },
    // { name: "Multiplication", path: "/multiplication/4", icon: "✖️" },
    // { name: "Division", path: "/division/4", icon: "➗" },
    // { name: "Factorial", path: "/factorial/4", icon: "!" },
    {name:"Coming Soon",path:"/404", icon:"!" },
  ],
  "Class 5": [
    // { name: "Addition", path: "/addition/5", icon: "➕" },
    // { name: "Subtraction", path: "/subtraction/5", icon: "➖" },
    // { name: "Multiplication", path: "/multiplication/5", icon: "✖️" },
    // { name: "Division", path: "/division/5", icon: "➗" },
    // { name: "Factorial", path: "/factorial/5", icon: "!" },
    // { name: "Decimal", path: "/decimal/5", icon: "🔢" },
    {name:"Coming Soon",path:"/404", icon:"!" },
  ],
  "Class 6": [
    // { name: "Addition", path: "/addition/6", icon: "➕" },
    // { name: "Subtraction", path: "/subtraction/6", icon: "➖" },
    // { name: "Multiplication", path: "/multiplication/6", icon: "✖️" },
    // { name: "Division", path: "/division/6", icon: "➗" },
    // { name: "Factorial", path: "/factorial/6", icon: "!" },
    // { name: "Decimal", path: "/decimal/6", icon: "🔢" },
    {name:"Coming Soon",path:"/404", icon:"!" },
  ],
  "Class 7": [
    // { name: "Addition", path: "/addition/7", icon: "➕" },
    // { name: "Subtraction", path: "/subtraction/7", icon: "➖" },
    // { name: "Multiplication", path: "/multiplication/7", icon: "✖️" },
    // { name: "Division", path: "/division/7", icon: "➗" },
    // { name: "Factorial", path: "/factorial/7", icon: "!" },
    // { name: "Decimal", path: "/decimal/7", icon: "🔢" },
    {name:"Coming Soon",path:"/404", icon:"!" },
  ],
  "Class 8": [
    // { name: "Addition", path: "/addition/8", icon: "➕" },
    // { name: "Subtraction", path: "/subtraction/8", icon: "➖" },
    // { name: "Multiplication", path: "/multiplication/8", icon: "✖️" },
    // { name: "Division", path: "/division/8", icon: "➗" },
    // { name: "Factorial", path: "/factorial/8", icon: "!" },
    // { name: "Decimal", path: "/decimal/8", icon: "🔢" },
    {name:"Coming Soon",path:"/404", icon:"!" },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ selectedClass, selectedOperation, onClose }) => {
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
    if (onClose) onClose();
  };

  return (
    <div className="w-[280px] sm:w-64 h-screen overflow-y-auto bg-white shadow-lg scroll-smooth scrollbar fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ">
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 p-4 md:p-4">
        <button 
          onClick={() => {
            navigate('/');
            if (onClose) onClose();
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/mathlogo.png"
            alt="YoungLabs Logo"
            width={40}
            height={40}
           
          />
          <h2 className="text-lg sm:text-xl font-bold text-animate text-[#55D400] bg-clip-text text-transparent bg-gradient-to-r from-mathBlue to-mathPurple">Math Adventures</h2>
        </button>
      </div>

      <div className="space-y-1 p-4">
        {Object.entries(classOperations).map(([className, operations]) => (
          <div key={className}>
            <Button
              variant="ghost"
              className={`w-full justify-between text-sm sm:text-base ${
                selectedClass === className ? 'bg-gray-100' : ''
              }`}
              onClick={() => toggleClass(className)}
            >
              <span>{className}</span>
              {expandedClasses.includes(className) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            {expandedClasses.includes(className) && (
              <div className="ml-4 space-y-1 mt-1">
                {operations.map((operation) => (
                  <Button
                    key={operation.path}
                    variant="ghost"
                    className={`w-full justify-start text-sm sm:text-base ${
                      selectedOperation === operation.path.split('/')[1] ? 'bg-gray-100' : ''
                    }`}
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
