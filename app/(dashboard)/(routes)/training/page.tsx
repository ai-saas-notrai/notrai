// QuizPage.jsx or QuizPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import StartCard from "@/components/training/StartCard";
import Question from "@/components/training/Question";
import HighScores from "@/components/training/HighScores";
import AllDone from "@/components/training/AllDone";
import TimeUp from "@/components/training/TimeUp";
import { Heading } from "@/components/heading";
import { BookOpenCheck } from "lucide-react";
import questionsData from '@/components/training/questions'; // Updated structure with lessons
import ReactMarkdown from 'react-markdown';

const QuizPage: React.FC = () => {
  const [state, setState] = useState<string>("start");
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [isViewingLesson, setIsViewingLesson] = useState<boolean>(true);
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(3600000); // Example: 1 hour for the quiz
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number[]>([]);
  const [deduct, setDeduct] = useState<boolean>(false);
  const [lessonContent, setLessonContent] = useState("");


  useEffect(() => {
    const loadLessonContent = async () => {
      const lessonFileName = `lesson${currentLessonIndex + 1}.md`; // Ensure this matches your file naming
      try {
        // Assuming your markdown files are in the public directory under /markdowns
        const response = await fetch(`/markdowns/${lessonFileName}`);
        if(response.ok) {
          const text = await response.text();
          setLessonContent(text);
        } else {
          throw new Error('Failed to fetch lesson content');
        }
      } catch (error) {
        console.error("Failed to load lesson content", error);
        toast.error("Failed to load lesson content.");
      }
    };
  
    loadLessonContent();
  }, [currentLessonIndex]);

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
    const currentLesson = questionsData[currentLessonIndex];
    if (questionNo + 1 < currentLesson.questions.length) {
      setQuestionNo(questionNo + 1);
    } else {
      setIsViewingLesson(true); // After the last question, show the lesson completion screen or move to the next lesson
      handleNextLesson();
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex + 1 < questionsData.length) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setQuestionNo(0); // Reset question number for the new lesson
    } else {
      setState("done"); // If there are no more lessons
      setTimerOn(false);
    }
  };

  const handleReset = () => {
    setState("start");
    setCurrentLessonIndex(0);
    setIsViewingLesson(true);
    setQuestionNo(0);
    setScore(0);
    setTime(3600000); // Reset the timer as well
    setTimerOn(false);
  };

  const handleTimerStart = () => {
    setTimerOn(true);
  };

  const handleWrongAnswer = () => {
    setDeduct(true); // Implement deduction logic if required
  };

  const handleHighScore = (newScore: number) => {
    setHighScore((prevScores) => [...prevScores, newScore]);
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
        title="Training Course"
        description="
        As mandated by California law, all aspiring notaries are required to undertake a comprehensive training course—3 hours for renewing notaries and 6 hours for new applicants."
        icon={BookOpenCheck}
        iconColor="text-green-700"
        bgColor="text-green-700/10"
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
           {state === "quiz" && isViewingLesson && (
              <div className="p-4 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">{questionsData[currentLessonIndex].title}</h2>
                {lessonContent && (
                  <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm mb-6 prose">
                    <ReactMarkdown>{lessonContent}</ReactMarkdown>
                  </div>
                )}
                <Button 
                  className="col-span-12 lg:col-span-2 w-full" 
                  type="submit" 
                  size="icon" 
                  onClick={() => setIsViewingLesson(false)}>
                    Start Questions
                </Button>
              </div>
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
