"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import StartCard from "@/components/exam/StartCard";
import Question from "@/components/exam/Question";
import HighScores from "@/components/exam/HighScores";
import AllDone from "@/components/exam/AllDone";
import TimeUp from "@/components/exam/TimeUp";
import { Heading } from "@/components/heading";
import { FileClock } from "lucide-react";
import questionsData from '@/components/exam/questions'; // Assuming this is an array of question objects



// Immediately shuffle and limit the questions upon loading the component
const QuizPage: React.FC = () => {
  const [state, setState] = useState<string>("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(3600000);
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
    if (questionNo + 1 < questionsData.length) {
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

  const handleTimerStart = () => {
    setTimerOn(true);
  };

  const handleWrongAnswer = () => {
    setDeduct(true);
  };

  const handleHighScore = (newScore: number) => {
    setHighScore((prevScores) => {
      return [...prevScores, newScore];
    });
  };

  const handleClearHighScore = () => {
    setHighScore([]);
  };

  const handleState = (newState: string) => {
    setState(newState);
  };
  
  const handleScore = (UserScore: number) => {
    setScore(UserScore);
  };

  return (
    <div> 
      <Heading
        title="Notary Preparation Exam"
        description="Advance Your Preparation with Our Comprehensive Notary exam."
        icon={FileClock}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="top-0 right-20 p-4 text-black">
      <span>Time: {Math.floor(time / 60000)}m {Math.floor((time % 60000) / 1000)}s</span>

      </div>
      <main className="flex-grow pt-5 p-4">
        <div className="flex flex-col min-h-screen">
          <div className="justify-center">
            {state === "start" && (
              <StartCard
                handleState={handleState}
                handleTimerStart={handleTimerStart}
              />
            )}
            {state === "quiz" && (
              <Question
                questionText={questionsData[questionNo].questionText}
                options={questionsData[questionNo].options}
                answer={questionsData[questionNo].answer}
                handleQuestion={handleQuestion}
                handleScore={handleScore}
                handleWrongAnswer={handleWrongAnswer}
              />
            )}
            {state === "highscore" && (
              <HighScores
                handleState={handleState}
                highScore={highScore}
                handleClearHighScore={handleClearHighScore}
                handleReset={handleReset}
              />
            )}
            {state === "done" && (
              <AllDone
                score={score}
                handleHighScore={handleHighScore}
                handleState={handleState}
              />
            )}
            {state === "timeup" && <TimeUp handleState={handleState} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
