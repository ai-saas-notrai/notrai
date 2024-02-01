import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import if not already in the file

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8 md:px-10 md:py-16 bg-white shadow-lg rounded-2xl border border-gray-200">
        <div className="flex justify-center items-center flex-col gap-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Coding Quiz Challenge
            <Badge variant="premium" className="ml-2 uppercase text-xs py-1">New</Badge>
          </h1>
          <p className="text-center text-md text-gray-700 font-medium mb-4">
            Try to answer the following code-related questions within the time limit.
          </p>
          <p className="text-center text-md text-gray-700 font-medium">
            Keep in mind that incorrect answers will penalize your score/time by ten seconds!
          </p>
        </div>
        <Button 
          className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          onClick={() => { handleState("quiz"); handleTimerStart(); }}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default StartCard;
