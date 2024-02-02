import React, { useState } from "react";

const Question = ({
  questionText,
  options,
  answer,
  handleQuestion,
  handleScore,
  handleWrongAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswer = (option) => {
    if (answer === option) {
      setIsCorrect(true);
      handleScore(prevScore => prevScore + 10);
    } else {
      setIsCorrect(false);
      handleWrongAnswer();
    }
    handleQuestion();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px', paddingTop: "20px", paddingBottom: "20px" }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          {questionText}
        </h1>
        {options.map((option, index) => (
          <div
            key={index}
            // Increased margin for more space between options
            className="my-6 p-3 border border-gray-300 shadow rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleAnswer(option)}
          >
            <span className="font-medium text-sm text-gray-700">{option}</span>
          </div>
        ))}
        <br />
        <hr />
        <br />
        {isCorrect === null && (
          <p className="font-medium drop-shadow-sm ml-3">
            Choose the best answer from the multiple choices.
          </p>
        )}
        {isCorrect !== null && (
          <p className={`mt-4 font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Question;
