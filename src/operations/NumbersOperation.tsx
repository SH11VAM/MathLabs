import ComparisonGame from '@/components/ComparisonGame'
import React from 'react'

const NumbersOperation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-magic-light-purple/20">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-magic-purple mb-2 animate-fade-in">
            Magic Number Line 🪄
          </h1>
          <p className="text-xl text-gray-600 animate-slide-right">
            Learn which number is bigger, smaller, or equal!
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 animate-scale-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-magic-blue mb-2">
              👧👦 Welcome Kids! Let's Compare Numbers
            </h2>
            <p className="text-lg text-gray-600">
              The number line starts with small numbers on the left and big numbers on the right.
            </p>
          </div>
          
          <ComparisonGame />
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-center mb-4">🎯 Remember:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-magic-yellow/20 p-4 rounded-lg">
                <p className="text-lg">
                  👉 When a number is more to the <strong>right</strong>, it is <strong>greater</strong>.
                </p>
              </div>
              <div className="bg-magic-pink/20 p-4 rounded-lg">
                <p className="text-lg">
                  👉 When a number is more to the <strong>left</strong>, it is <strong>less</strong>.
                </p>
              </div>
              <div className="bg-magic-green/20 p-4 rounded-lg">
                <p className="text-lg">
                  👉 When two numbers are at the <strong>same spot</strong>, they are <strong>equal</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Magic Number Line | Fun Learning for Kids</p>
        </footer>
      </div>
    </div>
  )
}

export default NumbersOperation