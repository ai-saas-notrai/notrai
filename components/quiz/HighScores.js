import React from 'react'
import { Button } from "@/components/ui/button";

const HighScores = ({ handleState, highScore, handleClearHighScore, handleReset }) => {
  let sortedList = highScore?.sort((a, b) => b.score - a.score) || [];

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px", paddingRight: "50px", paddingLeft: "50px" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6" style={{paddingBottom: "20px"}}>
          Highscores
        </h1>
        {sortedList.map((entry, index) => (
          <p key={index} className="text-md text-gray-700 font-medium mb-4 text-center">
            {index + 1}. {entry.name} - {entry.score}
          </p>
        ))}
        <div className="flex flex-col space-y-4 mt-6">
        <Button 
          className="col-span-12 lg:col-span-2 w-full" 
          type="submit" 
          size="icon"

          onClick={() => {
            handleReset();
            handleState("start");
            
          }}
            
          >
            Go Back
          </Button>
          <Button 
            className="col-span-12 lg:col-span-2 w-full" 
            type="submit" 
            size="icon"
            onClick={handleClearHighScore}
          >
            Clear Highscores
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HighScores;
