
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Divide, X } from 'lucide-react';
import MathHeader from '../components/MathHeader';
import OperationCard from '../components/OperationCard';

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MathHeader />
      
      <main className="flex-1 px-6 py-8 md:px-12 md:py-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="heading-xl mb-3">
            <span className="text-gradient">Fun</span>Math Adventure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn math step-by-step with fun animations and interactive examples!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <OperationCard 
            title="Addition" 
            icon={<Plus />} 
            color="bg-mathBlue" 
            operation="addition"
            delay={1}
          />
          <OperationCard 
            title="Subtraction" 
            icon={<Minus />} 
            color="bg-mathPink" 
            operation="subtraction"
            delay={2}
          />
          <OperationCard 
            title="Multiplication" 
            icon={<X />} 
            color="bg-mathPurple" 
            operation="multiplication"
            delay={3}
          />
          <OperationCard 
            title="Division" 
            icon={<Divide />} 
            color="bg-mathGreen" 
            operation="division"
            delay={4}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
