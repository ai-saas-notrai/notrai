import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";


const StartCard = ({ handleState, handleTimerStart }) => {
  const proModal = useProModal(); // Assuming this is correctly set up to manage the modal
  const [isPro, setIsPro] = useState(false); // State to track if the user is a Pro

  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        const status = await checkSubscription(); // Assuming this function returns a boolean
        setIsPro(status);
      } catch (error) {
        console.error('Error checking subscription status:', error);
        // Handle error appropriately
      }
    };

    checkUserSubscription();
  }, []);

  const startQuestionsOrPromptUpgrade = () => {
    if (!isPro) {
      proModal.onOpen(); // Open the modal for non-Pro users
    } else {
      handleState("quiz") 
      handleTimerStart(); // Pro users can start the quiz
    }
  };

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
          onClick={startQuestionsOrPromptUpgrade}
        >
          Start Exam
        </Button>

      </div>
    </div>
  );
};

export default StartCard;
