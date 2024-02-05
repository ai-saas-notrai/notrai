import React from "react";
import { Button } from "@/components/ui/button";

const StartCard = ({ handleState, handleTimerStart }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px" }}>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
            Notary Exam 
          </h1>
          <p className="text-center text-md text-gray-700 font-medium mb-5">
            The following is an official 6hr Ca Notary Exam. Your preparation will be tested with scenarios and questions based on real notary practices and the official handbook.
          </p>
          <p className="text-center text-md text-gray-700 font-medium mb-4">
            Do not close this window. Time will reset. You must complete the entrire exam for the full diration. 
          </p>
        <Button 
          className="col-span-12 lg:col-span-2 w-full" 
          type="submit" 
          size="icon" 
          onClick={() => { handleState("quiz"); handleTimerStart(); }}
        >
          Start Exam
        </Button>

      </div>
    </div>
  );
};

export default StartCard;
