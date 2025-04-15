
import React from 'react';


interface OwlTeacherProps {
  showSpeechBubble: boolean;
}

const OwlTeacher: React.FC<OwlTeacherProps> = ({ showSpeechBubble }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="speech-bubble bg-white p-4 rounded-3xl shadow-lg mb-6 z-10 animate-bounce-in">
          <p className="font-marker text-kid-purple text-xl md:text-2xl">Let's add tens and ones!</p>
        </div>
      )}
      
      {/* Owl Body */}
      <div className="relative animate-float  w-52 h-52">
        {
        
        showSpeechBubble==true ? (<img src='/owl.png'  alt='owl picture' />):(<img src='/owlFun.png'  alt='owl picture' />)
        }
        
       </div>
    </div>
  );
};

export default OwlTeacher;
