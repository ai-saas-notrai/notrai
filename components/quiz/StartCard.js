import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="mx-auto px-20 py-40 md:px-16 md:py-24 bg-white shadow-lg rounded-2xl border border-gray-200" style={{ borderRadius: '30px' }}> {/* Further increased padding */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          Coding Quiz Challenge
        </h1>
        <p className="text-center text-lg text-gray-700 font-medium mb-6">
          Try to answer the following code-related questions within the time limit.
        </p>
        <p className="text-center text-lg text-gray-700 font-medium mb-8">
          Keep in mind that incorrect answers will penalize your score/time by ten seconds!
        </p>
        <Button 
          className="col-span-12 lg:col-span-2 w-full py-3 text-lg" 
          type="submit" 
          size="large" 
          onClick={() => { handleState("quiz"); handleTimerStart(); }}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default StartCard;
