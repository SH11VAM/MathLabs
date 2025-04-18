
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FractionIntroduction from '@/components/fraction/FractionIntroduction';
import FractionParts from '@/components/fraction/FractionParts';
import FractionExamples from '@/components/fraction/FractionExample';
import InteractiveFractions from '@/components/fraction/InteractiveFractions';

const FractionOperation = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Auto-advance through sections for the guided experience
  useEffect(() => {
    if (!showAll && activeSection < 4) {
      const timer = setTimeout(() => {
        setActiveSection(prev => prev + 1);
      }, 10000); // 10 seconds per section
      
      return () => clearTimeout(timer);
    }
  }, [activeSection, showAll]);

  const sections = [
    {
      id: 'intro',
      title: 'What are Fractions?',
      component: <FractionIntroduction />
    },
    {
      id: 'parts',
      title: 'Numerator & Denominator',
      component: <FractionParts />
    },
    {
      id: 'examples',
      title: 'Fraction Examples',
      component: <FractionExamples />
    },
    {
      id: 'practice',
      title: 'Let\'s Practice',
      component: <InteractiveFractions />
    },
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-12 fraction-container">
      <header className="bg-gradient-to-r from-kid-purple to-kid-blue py-6 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Fun With Fractions!
          </h1>
          
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white text-kid-purple px-4 py-2 rounded-full font-bold hover:bg-kid-yellow transition-colors"
          >
            {showAll ? "Guided Tour" : "Show All Sections"}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!showAll ? (
          <>
            {/* Navigation dots */}
            <div className="flex justify-center mb-8">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`w-4 h-4 rounded-full mx-2 transition-colors ${
                    index === activeSection 
                      ? 'bg-kid-purple' 
                      : index < activeSection 
                        ? 'bg-kid-pink' 
                        : 'bg-gray-300'
                  }`}
                  aria-label={`Go to ${section.title}`}
                />
              ))}
            </div>
            
            {/* Current section */}
            <motion.div
              key={sections[activeSection].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {sections[activeSection].component}
            </motion.div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
                disabled={activeSection === 0}
                className={`px-6 py-3 rounded-full font-bold ${
                  activeSection === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-kid-blue text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
                disabled={activeSection === sections.length - 1}
                className={`px-6 py-3 rounded-full font-bold ${
                  activeSection === sections.length - 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-kid-blue text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          // Show all sections at once
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                {section.component}
              </section>
            ))}
          </div>
        )}
      </main>
      
       
    </div>
  );
};

export default FractionOperation ;
