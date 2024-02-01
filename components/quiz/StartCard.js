import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: 20, paddingBottom: 20 }}>
        {/* Empty line with padding for spacing */}
        <div className="py-10 py-10 text-white-700"> </div> 
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          Coding Quiz Challenge
        </h1>
        <p className="text-center text-md text-gray-700 font-medium mb-5">
          Try to answer the following code-related questions within the time limit.
        </p>
        <p className="text-center text-md text-gray-700 font-medium mb-4">
          Keep in mind that incorrect answers will penalize your score/time by ten seconds!
        </p>
        <Button 
          className="col-span-12 lg:col-span-2 w-full" 
          type="submit" 
          size="icon" 
          onClick={() => { handleState("quiz"); handleTimerStart(); }}
        >
          Start Quiz
        </Button>
        {/* Empty line with padding for spacing */}
        <div className="py-10 text-white-700"> </div> 
      </div>
    </div>
  );
};

export default StartCard;


style="border-radius:30px;padding-top: 20px;padding-bottom: 20px;">