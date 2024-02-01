import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px' }}>
        {/* Uniform padding around the content */}
        <div className="flex flex-col justify-between h-full p-10 md:p-12"> 
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
              Coding Quiz Challenge
            </h1>
            <p className="text-center text-md text-gray-700 font-medium mb-5">
              Try to answer to following code-related questions within time limit.
            </p>
            <p className="text-center text-md text-gray-700 font-medium mb-6">
              Keep in mind that incorrect answers will penalize your score/time by ten seconds!
            </p>
          </div>
          <Button 
            className="col-span-12 lg:col-span-2 w-full mt-8 mb-6" // Added margin-top for spacing and margin-bottom for padding from the bottom edge
            type="submit" 
            size="icon" 
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
