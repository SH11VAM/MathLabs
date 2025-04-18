
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FindNextShape from "@/components/pattern/game/FindNextShape";
import CompletePattern from "@/components/pattern/game/CompletePattern";
import GrowingPattern from "@/components/pattern/game/GrowingPattern";
import CreatePattern from "@/components/pattern/game/CreatePattern";

const PatternOperation = () => {
  const [activeGame, setActiveGame] = useState<string>("find");
  const [level, setLevel] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Pattern Play Palace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn to recognize, complete, and create patterns through fun interactive games!
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <Tabs
            defaultValue="find"
            value={activeGame}
            onValueChange={setActiveGame}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-6 ">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <TabsTrigger
                  value="find"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                >
                  Find Next Shape
                </TabsTrigger>
                <TabsTrigger
                  value="complete"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
                >
                  Complete Pattern
                </TabsTrigger>
                <TabsTrigger
                  value="growing"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
                >
                  Growing Pattern
                </TabsTrigger>
                <TabsTrigger
                  value="create"
                  className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700"
                >
                  Create Pattern
                </TabsTrigger>
              </TabsList>

              {activeGame !== "create" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Level:</span>
                  <select
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <TabsContent value="find" className="mt-0">
              <FindNextShape level={level} />
            </TabsContent>

            <TabsContent value="complete" className="mt-0">
              <CompletePattern level={level} />
            </TabsContent>

            <TabsContent value="growing" className="mt-0">
              <GrowingPattern level={level} />
            </TabsContent>

            <TabsContent value="create" className="mt-0">
              <CreatePattern />
            </TabsContent>
          </Tabs>
        </div>

       
      </motion.div>
    </div>
  );
};

export default PatternOperation;
