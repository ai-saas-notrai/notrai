import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({handleState, handleTimerStart}) => {
  return (
    <div className="flex flex-col justify-center h-[90vh]">
      <div className="lg:w-6/12 w-10/12 mx-auto px-10 py-16 outline outline-slate-300 outline-2 rounded-3xl shadow-xl">
        <h1 className="font-black font-Inter mb-6 drop-shadow-sm">
          Coding Quiz Challenge
        </h1>
        <p className=" font-medium drop-shadow-sm mb-5">
          Try to answer to following code-related questions within time limit.
        </p>
        <p className=" font-medium drop-shadow-sm mb-4">
          Keep in ind that incorrect answers will penalize your score/time bey
          ten seconds!
        </p>
        <Button className="col-span-12 lg:col-span-2 w-full" type="submit" size="icon" onClick={() => {handleState("quiz"); handleTimerStart();}}>
          Start Quiz
        </Button>
      </div>
    </div>
  );
};

export default StartCard;
