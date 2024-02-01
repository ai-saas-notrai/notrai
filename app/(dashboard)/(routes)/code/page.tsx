"use client";

// If you're not using TypeScript, remove types and interfaces.
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Corrected import paths according to typical project structure
import { Button } from "@/components/ui/button";
import StartCard from "@/components/quiz/StartCard";
import Question from "@/components/quiz/Question";
import HighScores from "@/components/quiz/HighScores";
import AllDone from "@/components/quiz/AllDone";
import TimeUp from "@/components/quiz/TimeUp";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";

// Correct this import to point to your questions data
import questions from '@/components/quiz/questions'; // Assuming this is an array of question objects


const QuizPage: React.FC = () => {
  const [state, setState] = useState<string>("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(50000);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number[]>([]);
  const [deduct, setDeduct] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerOn && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerOn, time]);

  useEffect(() => {
    if (time <= 0 && timerOn) {
      toast.error("Time's up!");
      setState("timeup");
      setTimerOn(false);
    }
  }, [time, timerOn]);

  const handleQuestion = (isCorrect: boolean) => {
    if (isCorrect) setScore(score + 10);
    if (questionNo + 1 < questions.length) {
      setQuestionNo(questionNo + 1);
    } else {
      setState("done");
      setTimerOn(false);
    }
  };

  const handleReset = () => {
    setState("start");
    setQuestionNo(0);
    setScore(0);
    setTime(50000);
    setTimerOn(false);
  };

  //Functions to Start the timer
  const handleTimerStart = () => {
    setTimerOn(true);
  };

  const handleWrongAnswer = () => {
    setDeduct(true);
  };

  //Hanlde The High Scores

  const handleHighScore = (newScore:number) => {
    setHighScore((prevScores) => {
      return [...prevScores, newScore];
    });
  };

  //Clear High Scores
  const hadleClearHighScore = () => {
    setHighScore([]);
  };

  const handleState = (newState:string) => {
    setState(newState);
  };
  const handleScore = (UserScore:number) => {
    setScore(UserScore);
  };

  return (
    

    <div> 
        <Heading
        title="Notary Preparation Exam"
        description="Our most advanced Notary information model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
          />
        <div>
        </div>
        
        {/* Place the time element in the top right corner */}
        <div className="fixed top-0 right-20 p-4 text-black">
          <span>Time: {Math.floor(time / 1000)}s</span>
        </div>
      <main className="flex-grow pt-24 p-4">
      <div className="flex flex-col min-h-screen">
        <div className=" justify-center">
          {state === "start" && (
            <StartCard
              handleState={handleState}
              handleTimerStart={handleTimerStart}
            />
          )}
          {state === "quiz" && (
            <Question
              questionText={questions[questionNo].questionText}
              options={questions[questionNo].options}
              answer={questions[questionNo].answer}
              handleQuestion={handleQuestion}
              handleScore={handleScore}
              handleWrongAnswer={handleWrongAnswer}
            />
          )}
          {state === "highscore" && (
            <HighScores
              handleState={handleState}
              highScore={highScore}
              hadleClearHighScore={hadleClearHighScore}
            />
          )}
          {state === "done" && (
            <AllDone
              score={score}
              handleHighScore={handleHighScore}
              handleState={handleState}
              handleReset={handleReset}
            />
          )}
          {state === "timeup" && (
           <TimeUp 
             handleState ={handleState}
           />

          )}
        </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
