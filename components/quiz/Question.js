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
  const [score, setScore] = useState(0);

  const handleAnswer = (userAnswer) => {
    if (answer === userAnswer) {
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 10);
      handleScore(score + 10);
    } else {
      setIsCorrect(false);
      handleWrongAnswer();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="mx-auto px-8 py-16 md:px-12 md:py-20 bg-white shadow-lg rounded-xl border border-gray-200" style={{ borderRadius: '30px' }}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          {questionText}
        </h1>
        {options && (
          <>
            {options.map((option, index) => (
              <button
                key={index}
                className="w-full text-left font-medium bg-blue-600 text-white p-3 rounded-lg my-2 hover:bg-blue-700 transition-all cursor-pointer"
                onClick={() => {
                  handleAnswer(option);
                  handleQuestion();
                }}
              >
                {option}
              </button>
            ))}
          </>
        )}
        {isCorrect !== null && (
          <p className={`font-medium ml-3 mt-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Question;
