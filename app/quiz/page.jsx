'use client';
import React, { useState, useEffect, useRef } from 'react';
import { quiz } from '../data.js';

function formatTime(milliseconds) {
  let date = new Date(milliseconds);
  //let hours = date.getHours();
  let minutes = date.getUTCHours()*60 + date.getMinutes();  // if hour passes, add it to the minutes
  let seconds = date.getSeconds();

  //hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes +  ':' + seconds;
}
function formatTimeResult(milliseconds) {
  let date = new Date(milliseconds);
  //let hours = date.getHours();
  let minutes = date.getUTCHours()*60 + date.getMinutes();
  let seconds = date.getSeconds();

  let R = '';
  if (minutes >= 1)
    R = minutes + 'minutes ';
  R += seconds + ' seconds'
  return R;
}
const page = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const startTime = new Date().getTime();

  const { questions } = quiz;
  const { question, answers, correctAnswer } = questions[activeQuestion];

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date().getTime()-startTime);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  //   Select and check answer
  const onAnswerSelected = (answer, idx) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
      console.log('true');
    } else {
      setSelectedAnswer(false);
      console.log('false');
    }
  };

  // Calculate score and increment to next question
  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
      clearInterval(intervalRef.current);
    }
    setChecked(false);
  };

  return (
    <div className='container'>
      <h1>Quiz Page</h1>
      <div>
        <h2>
          Time: {formatTime(currentTime)}
        </h2>
        <h2>
          Question: {activeQuestion + 1}
          <span>/{questions.length}</span>
        </h2>
      </div>
      <div>
        {!showResult ? (
          <div className='quiz-container'>
            <h3>{questions[activeQuestion].question}</h3>
            {answers.map((answer, idx) => (
              <li
                key={idx}
                onClick={() => onAnswerSelected(answer, idx)}
                className={
                  selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                }
              >
                <span>{answer}</span>
              </li>
            ))}
            {checked ? (
              <button onClick={nextQuestion} className='btn'>
                {activeQuestion === question.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button onClick={nextQuestion} disabled className='btn-disabled'>
                {' '}
                {activeQuestion === question.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        ) : (
          <div className='quiz-container'>
            <h3>Results</h3>
            <h3>Overall: {(result.score / 25) * 100}%</h3>
            <p>
              Total Questions: <span>{questions.length}</span>
            </p>
            <p>
              Total Score: <span>{result.score}</span>
            </p>
            <p>
              Correct Answers: <span>{result.correctAnswers}</span>
            </p>
            <p>
              Wrong Answers: <span>{result.wrongAnswers}</span>
            </p>
            <p>
              Total Time Taken: <span>{formatTimeResult(currentTime)}</span>
            </p>
            <button onClick={() => window.location.reload()}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
