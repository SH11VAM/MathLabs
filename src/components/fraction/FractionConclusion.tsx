
import React from 'react';
import { motion } from 'framer-motion';

const FractionConclusion: React.FC = () => {
  // Examples of fractions in daily life with images represented by divs
  const examples = [
    {
      title: "Pizza Slices",
      description: "When you share a pizza with friends, each slice is a fraction of the whole pizza!",
      visual: (
        <div className="w-full h-32 bg-kid-orange rounded-full overflow-hidden relative">
          <div className="absolute w-full h-0.5 bg-kid-red top-1/2 left-0"></div>
          <div className="absolute h-full w-0.5 bg-kid-red top-0 left-1/2"></div>
          <div className="absolute w-full h-1 bg-kid-red transform rotate-45 origin-center"></div>
          <div className="absolute w-full h-1 bg-kid-red transform -rotate-45 origin-center"></div>
        </div>
      )
    },
    {
      title: "Sharing Toys",
      description: "If you have 3 toys and share them with 2 friends, each person gets 1/3 of the toys!",
      visual: (
        <div className="flex justify-around items-center h-32">
          <div className="w-16 h-16 bg-kid-blue rounded-lg animate-bounce"></div>
          <div className="w-16 h-16 bg-kid-green rounded-lg animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-16 h-16 bg-kid-purple rounded-lg animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      )
    },
    {
      title: "Sliced Fruit",
      description: "When you cut an apple into 4 pieces, each piece is 1/4 of the whole apple!",
      visual: (
        <div className="w-full h-32 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-kid-red rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-white"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-0.5 bg-white"></div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-kid-purple rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-white mb-6">
        Fractions Are All Around Us!
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <h3 className="text-2xl font-bold mb-4 text-kid-purple">
          What We've Learned:
        </h3>
        
        <ul className="space-y-3 text-lg">
          <motion.li 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-kid-green rounded-full flex items-center justify-center text-white font-bold">1</div>
            <span>A <span className="font-bold">fraction</span> represents parts of a whole</span>
          </motion.li>
          
          <motion.li 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-kid-green rounded-full flex items-center justify-center text-white font-bold">2</div>
            <span>The <span className="font-bold text-kid-red">numerator</span> (top number) tells us how many parts we have</span>
          </motion.li>
          
          <motion.li 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-kid-green rounded-full flex items-center justify-center text-white font-bold">3</div>
            <span>The <span className="font-bold text-kid-blue">denominator</span> (bottom number) tells us the total number of equal parts</span>
          </motion.li>
          
          <motion.li 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-kid-green rounded-full flex items-center justify-center text-white font-bold">4</div>
            <span>Fractions can have different shapes like <span className="font-bold">1/2</span>, <span className="font-bold">1/3</span>, and <span className="font-bold">1/4</span></span>
          </motion.li>
        </ul>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-kid-purple">
          Fractions in Everyday Life
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-kid-yellow bg-opacity-30 p-4 rounded-lg"
            >
              <div className="mb-3">
                {example.visual}
              </div>
              <h4 className="text-xl font-bold mb-2">{example.title}</h4>
              <p>{example.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 bg-kid-pink bg-opacity-20 p-4 rounded-lg text-center"
        >
          <p className="text-xl font-bold">
            Fractions are a fun way to split things equally and share with others!
          </p>
          <p className="mt-2">
            Keep practicing and see how many fractions you can spot around you every day!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FractionConclusion;
