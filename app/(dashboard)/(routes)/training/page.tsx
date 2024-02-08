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
import questionsData from '@/components/training/questions'; // Assuming this import works correctly
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

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
    if (state === "quiz" && isViewingLesson) {
      const loadLessonContent = async () => {
        const lessonFileName = `lesson${currentLessonIndex + 1}.md`; // Ensure this matches your file naming
        try {
          const response = await fetch(`/lessons/${lessonFileName}`);
          if (response.ok) {
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
    }
  }, [currentLessonIndex, state, isViewingLesson]);

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
    if (isCorrect) {
      setScore(score + 10);
    }
    if (questionNo + 1 < questionsData[currentLessonIndex].questions.length) {
      setQuestionNo(questionNo + 1);
    } else {
      setIsViewingLesson(false); // Ensures we move to the next lesson or completion screen correctly
      handleNextLesson();
    }
  };

  const handleNextLesson = () => {
    const nextIndex = currentLessonIndex + 1;
    if (nextIndex < questionsData.length) {
      setCurrentLessonIndex(nextIndex);
      setQuestionNo(0);
      setIsViewingLesson(true); // Ensure we view the lesson content first
    } else {
      setState("done");
      setTimerOn(false);
    }
  };

  const handleStartQuestions = () => {
    setIsViewingLesson(false); // This was missing to ensure we move from lesson content to questions
  };

  const handleReset = () => {
    setState("start");
    setCurrentLessonIndex(0);
    setIsViewingLesson(true);
    setQuestionNo(0);
    setScore(0);
    setTime(3600000);
    setTimerOn(false);
  };

  const handleTimerStart = () => {
    setTimerOn(true);
  };

  const handleWrongAnswer = () => {
    setDeduct(true);
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
        description="As mandated by California law, all aspiring notaries are required to undertake a comprehensive training course—3 hours for renewing notaries and 6 hours for new applicants."
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
                <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm mb-6 prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lessonContent}</ReactMarkdown>
                </div>
                <Button 
                  className="col-span-12 lg:col-span-2 w-full" 
                  type="submit" 
                  size="icon" 
                  onClick={handleStartQuestions}>
                    Start Questions
                </Button>
              </div>
            )}
            {state === "quiz" && !isViewingLesson && (
              <Question
                questionText={questionsData[currentLessonIndex].questions[questionNo].questionText}
                options={questionsData[currentLessonIndex].questions[questionNo].options}
                answer={questionsData[currentLessonIndex].questions[questionNo].answer}
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
