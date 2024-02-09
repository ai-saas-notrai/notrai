import React, { useState } from "react";
import { Button } from "../ui/button";

const Question = ({
  questionText,
  options,
  answer,
  handleQuestion,
  handleScore,
  handleWrongAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false); // State to control "Next Question" button display

  const handleAnswer = (option) => {
    if (answer === option) {
      setIsCorrect(true);
      handleScore((prevScore) => prevScore + 10);
      // If the answer is correct, proceed to the next question without showing the next button
      handleQuestion(true);
    } else {
      setIsCorrect(false);
      handleWrongAnswer();
      // If the answer is wrong, show the correct answer and the "Next Question" button
      setShowNextButton(true);
    }
    // Do not immediately move to the next question if the answer is wrong
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          {questionText}
        </h1>
        
        <div className="text-left pt-2 space-y-2 text-zinc-900 font-medium">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-3 border border-gray-300 shadow rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100 my-2"
              onClick={() => handleAnswer(option)}
            >
              <span className="font-semibold text-sm text-gray-700">{option}</span>
            </div>
          ))}
        </div>
        <br />
        <hr />

        {isCorrect === null && (
          <p style={{ marginBottom: '16px' }} className="font-medium text-gray-700">
            Choose the best answer from the multiple choices.
          </p>
        )}
        {isCorrect !== null && (
          <p style={{ marginBottom: '16px' }} className={`mt-4 font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? "Correct!" : `Incorrect! The correct answer is: ${answer}.`}
          </p>
        )}
        {showNextButton && (
          <Button
            className="col-span-12 lg:col-span-2 w-full p-4" 
            type="submit" 
            size="icon" 
            onClick={() => {
              setShowNextButton(false); // Hide the button
              setIsCorrect(null); // Reset the answer correctness state
              handleQuestion(false); // Move to the next question
            }}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default Question;
