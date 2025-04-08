import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Book, Award, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mathBlue/20 via-mathPurple/20 to-mathPink/20 animate-gradient-x"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-mathBlue to-mathPurple">
              Welcome to Younglabs Adventure
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your interactive journey through mathematics, from basic operations to advanced concepts.
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate('/addition/1')}
              className="bg-gradient-to-r from-mathBlue to-mathPurple hover:from-mathPurple hover:to-mathBlue text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-mathBlue/10 p-3 rounded-full w-fit mb-4">
              <Calculator className="h-6 w-6 text-mathBlue" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Learning</h3>
            <p className="text-gray-600">Practice with real-time feedback and step-by-step guidance.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-mathPurple/10 p-3 rounded-full w-fit mb-4">
              <Book className="h-6 w-6 text-mathPurple" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Curriculum</h3>
            <p className="text-gray-600">Follow a carefully designed path from basic to advanced concepts.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="bg-mathPink/10 p-3 rounded-full w-fit mb-4">
              <Award className="h-6 w-6 text-mathPink" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement and celebrate your achievements.</p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How to Use</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-mathBlue to-mathPurple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Your Class</h3>
                <p className="text-gray-600">Choose your class level from the sidebar on the left</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-mathPurple to-mathPink text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Choose Operation</h3>
                <p className="text-gray-600">Select the mathematical operation you want to practice</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-mathPink to-mathBlue text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Practice & Learn</h3>
                <p className="text-gray-600">Follow the step-by-step instructions to solve problems</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-mathBlue to-mathPurple text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                <p className="text-gray-600">Get instant feedback and learn from your mistakes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-mathBlue to-mathPurple rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Math Journey?</h2>
            <p className="text-lg mb-8">Join thousands of students learning and having fun with MathLabs!</p>
            <Button
              size="lg"
              onClick={() => navigate('/addition/1')}
              className="bg-white text-mathBlue hover:bg-gray-100 font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
