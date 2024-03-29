import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";




const AllDone = ({ score, handleHighScore, handleState }) => {
  const [name, setName] = useState("");
  const totalQuestions = 45; // Total questions limited in the quiz
  const maxScore = totalQuestions * 10; // Maximum possible score
  const scorePercentage = (score / maxScore) * 100;
  const handleFireworks = () => {
    Fireworks(); // Trigger fireworks effect
  };
  

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          All Done!
        </h1>
        <p className="text-center text-md text-gray-700 font-medium mb-5">
          Your Final Score is: {scorePercentage.toFixed(2)}%
        </p>
        <div className="text-center font-medium mb-4">
          Enter Initials<span className="text-red-500">*</span>:
          <input
            className="block mx-auto mt-3 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 rounded-md text-sm w-full md:w-auto"
            placeholder="example: JS"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            id="submit"
          />
        </div>
        <Button 
          className="col-span-12 lg:col-span-2 w-full" 
          type="submit" 
          size="icon"
          id="submit"
          onClick={() => {
            
            handleHighScore({ name: name, score: scorePercentage.toFixed(2) });
            handleState("highscore");
            handleFireworks();
            
          }}
          disabled={!name} // Disable button if name is not entered
        >
          Submit
        </Button>
        
      </div>
    </div>
  );
};

export default AllDone;
