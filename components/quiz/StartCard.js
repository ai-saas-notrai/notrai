import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-10 bg-white shadow-lg rounded-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Coding Quiz Challenge
        </h1>
        <p className="text-center text-lg text-gray-700 font-medium mb-4">
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
