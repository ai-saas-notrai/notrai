"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import StartCard from "@/components/quiz/StartCard";
import Question from "@/components/quiz/Question";
import HighScores from "@/components/quiz/HighScores";
import AllDone from "@/components/quiz/AllDone";
import TimeUp from "@/components/quiz/TimeUp";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import questionsData from '@/components/quiz/questions'; // Assuming this is an array of question objects

// Added shuffle function directly inside the component to ensure it's clear where modifications have been made
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Immediately shuffle and limit the questions upon loading the component
const limitedQuestions = shuffle([...questionsData]).slice(0, 45);

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
    if (questionNo + 1 < limitedQuestions.length) {
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
        description="Advance Your Preparation with Our Comprehensive Notary Quiz."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="fixed bottom-0 center-20 p-4 text-black">
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
                questionText={limitedQuestions[questionNo].questionText}
                options={limitedQuestions[questionNo].options}
                answer={limitedQuestions[questionNo].answer}
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
