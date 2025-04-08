import React from "react";
import LongDivisionVisualizer from "@/components/LongDivisionVisualizer";

const DivisionOperation = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <main>
            <LongDivisionVisualizer />
          </main>

          <footer className="mt-16 text-center text-gray-500 text-sm">
            <p>
              A visual learning tool for mastering long division calculations
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DivisionOperation;
