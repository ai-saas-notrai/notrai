import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      {/* Card container with shadow, rounded borders, and increased internal padding */}
      <div className="w-full max-w-md mx-auto px-10 py-16 bg-white shadow-lg rounded-2xl border border-gray-200  ">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          Coding Quiz Challenge
        </h1>
        <p className="text-center text-md text-gray-700 font-medium mb-6">
          Try to answer to following code-related questions within time limit.
        </p>
        <p className="text-center text-md text-gray-700 font-medium mb-8">
          Keep in mind that incorrect answers will penalize your score/time by ten seconds!
        </p>
        <Button 
          className="w-full py-2 text-lg" 
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
