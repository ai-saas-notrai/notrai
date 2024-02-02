import React, { useState } from "react";

const AllDone = ({ score, handleHighScore, handleState, handleReset }) => {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          All Done!
        </h1>
        <p className="text-center text-md text-gray-700 font-medium mb-5">
          Your Final Score is: {score}
        </p>
        <div className="text-center font-medium mb-4">
          Enter Initials<span className="text-red-500">*</span>:
          <input
            className="block mx-auto mt-3 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-blue-500 rounded-md text-sm w-full md:w-auto"
            placeholder="example: JS"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <Button 
          className="col-span-12 lg:col-span-2 w-full" 
          type="submit" 
          size="icon"
          onClick={() => {
            handleHighScore({ name: name, score: score });
            handleState("highscore");
            handleReset();
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
