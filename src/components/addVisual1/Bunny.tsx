
import React from "react";

export const Bunny: React.FC = () => {
  return (
    <div className="relative lg:h-48 lg:w-36 h-20 w-20 animate-bounce-gentle">

     <img
     src="/bunny.png"
     alt="Bunny"
     width="100"
     height="100"
     />
      
      {/* Speech bubble */}
      <div className="absolute -top-14 -right-6 bg-white px-3 py-2 rounded-2xl shadow-md">
        <p className="lg:text-lg  text-sm  font-bold text-blue-500">Let's count!</p>
        {/* Speech bubble tail */}
        <div className="absolute bottom-0 left-6 w-4 h-4 bg-white transform rotate-45 translate-y-2"></div>
      </div>
    </div>
  );
};
