import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="mx-auto bg-white shadow-lg rounded-2xl border border-gray-200" style={{ borderRadius: '30px' }}>
        <div className="px-14 py-24 md:px-20 md:py-32"> {/* Padding applied to the content container */}
          <h1 className="px-14 text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Coding Quiz Challenge
          </h1>
          <p className="px-14 text-center text-lg text-gray-700 font-medium mb-6">
            Try to answer the following code-related questions within the time limit.
          </p>
          <p className="px-14 text-center text-lg text-gray-700 font-medium mb-8">
            Keep in mind that incorrect answers will penalize your score/time by ten seconds!
          </p>
          <Button 
            className="px-14 col-span-12 lg:col-span-2 w-full py-3 text-lg" 
            type="submit" 
            size="large" 
            onClick={() => { handleState("quiz"); handleTimerStart(); }}
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartCard;
