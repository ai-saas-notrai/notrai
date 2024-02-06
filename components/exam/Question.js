import React, { useState } from "react";
import { checkSubscription } from "@/lib/subscription";
import { incrementQuestionLimit, checkQuestionLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";

import { Loader } from "@/components/loader"; // Import your Loader component

const Question = ({
  questionText,
  options,
  answer,
  handleQuestion,
  handleScore,
  handleWrongAnswer,
}) => {
  const [isCorrect, setIsCorrect] = useState(null);

  const [loading, setLoading] = useState(true);
  const { userId } = auth(); // Assuming user ID is stored in a context
  const router = useRouter();

  useEffect(() => {
    const verifyUserAndSubscription = async () => {
      if (!userId) {
        // Handle unauthorized access
        router.replace("/login"); // Redirect to login page or show an error
        return;
      }

      try {
        const isPro = await checkSubscription();
        const freeTrial = await checkQuestionLimit();

        if (!freeTrial && !isPro) {
          // Redirect or inform the user to upgrade
          proModal.onOpen();
          return;
        }

        if (!isPro) {
          await incrementQuestionLimit();
        }

        setLoading(false); // User is authorized and can proceed
      } catch (error) {
        console.error('Error verifying user or subscription:', error);
        // Handle errors, potentially redirecting or showing a message
      }
    };

    verifyUserAndSubscription();
  }, [userId, router]);

  if (loading) {
    return <Loader />; 
  }
  
  

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
        <br />
        {isCorrect === null && (
          <p className="font-medium text-gray-700">
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
