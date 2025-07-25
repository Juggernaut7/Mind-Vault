// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import useFlashcards from '../hooks/useFlashcards.js';
import { generateQuiz } from '../lib/quizGenerator.js';
import Button from '../components/common/Button.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
  const { flashcards } = useFlashcards();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [message, setMessage] = useState('');

  // Generate quiz when flashcards change or quiz starts
  useEffect(() => {
    if (quizStarted && flashcards.length > 0) {
      if (flashcards.length < 4) { // Need at least 4 for 4 options
        setMessage("Need at least 4 flashcards to generate a quiz with multiple options. Add more notes!");
        setQuizStarted(false);
        return;
      }
      const newQuiz = generateQuiz(flashcards, 5, 4); // Generate 5 questions with 4 options
      setQuizQuestions(newQuiz);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setQuizFinished(false);
      setMessage('');
      if (newQuiz.length === 0) {
        setMessage("Could not generate quiz. Check if you have enough flashcards.");
        setQuizStarted(false);
      }
    } else if (flashcards.length === 0) {
      setMessage("No flashcards available to create a quiz. Please add some notes first!");
      setQuizStarted(false); // Ensure quiz doesn't start if no cards
    }
  }, [quizStarted, flashcards]); // Regenerate if quiz starts or flashcards change

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowFeedback(true);
    if (option === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
      setQuizStarted(false); // End the quiz session
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false); // Triggers useEffect to regenerate quiz
    setQuizFinished(false);
    setMessage('');
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="p-6 flex flex-col items-center justify-start min-h-full">
      <h1 className="text-4xl font-bold text-electric mb-8">Take a Quiz!</h1>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-text-light mb-4 bg-steel-dark px-4 py-2 rounded-lg text-sm"
        >
          {message}
        </motion.p>
      )}

      {!quizStarted && !quizFinished && (
        <div className="text-center bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark max-w-xl w-full">
          <p className="text-text-light text-lg mb-6">Ready to test your knowledge?</p>
          <Button onClick={handleStartQuiz} className="bg-electric hover:bg-electric-dark text-midnight">
            Start Quiz
          </Button>
          <p className="text-text-dark text-sm mt-4">
            (Quiz questions are generated from your existing flashcards.)
          </p>
        </div>
      )}

      {quizStarted && !quizFinished && currentQuestion && (
        <motion.div
          key={currentQuestion.id} // Key to animate question change
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark flex flex-col items-center justify-center min-h-[400px]"
        >
          <p className="text-text-dark text-sm mb-4">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </p>
          <h2 className="text-2xl font-semibold text-electric mb-6 text-center">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showFeedback && handleOptionSelect(option)}
                className={`w-full text-left p-3 rounded-md transition-all duration-300
                  ${showFeedback
                    ? (option === currentQuestion.correctAnswer
                      ? 'bg-green-700 text-text-light cursor-not-allowed'
                      : (option === selectedOption ? 'bg-red-700 text-text-light cursor-not-allowed' : 'bg-steel-dark text-text-dark cursor-not-allowed'))
                    : 'bg-steel-dark hover:bg-steel-light text-text-light'
                  }
                `}
                disabled={showFeedback}
              >
                {option}
              </Button>
            ))}
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              {selectedOption === currentQuestion.correctAnswer ? (
                <p className="text-green-400 text-xl font-bold">Correct!</p>
              ) : (
                <p className="text-red-400 text-xl font-bold">Incorrect. The correct answer was: <span className="text-electric">{currentQuestion.correctAnswer}</span></p>
              )}
              <Button
                onClick={handleNextQuestion}
                className="mt-4 bg-electric hover:bg-electric-dark text-midnight"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {quizFinished && (
        <div className="text-center bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark max-w-xl w-full">
          <h2 className="text-3xl font-bold text-electric mb-4">Quiz Finished!</h2>
          <p className="text-text-light text-xl mb-6">
            You scored: <span className="text-electric">{score}</span> / {quizQuestions.length}
          </p>
          <Button onClick={handleRestartQuiz} className="bg-violet-glow hover:bg-violet-glow-dark text-text-light">
            Restart Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;