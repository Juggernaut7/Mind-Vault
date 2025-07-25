// src/lib/quizGenerator.js

/**
 * Generates quiz questions from a set of flashcards.
 * @param {Array<object>} flashcards - An array of flashcard objects: [{ question: string, answer: string }]
 * @param {number} numQuestions - Desired number of quiz questions
 * @param {number} numOptions - Number of multiple-choice options (including correct answer)
 * @returns {Array<object>} An array of quiz question objects:
 * [{ id: string, question: string, options: string[], correctAnswer: string }]
 */
export const generateQuiz = (flashcards, numQuestions = 5, numOptions = 4) => {
    if (!flashcards || flashcards.length < numOptions) {
      console.warn('Not enough flashcards to generate a meaningful quiz.');
      return [];
    }
  
    const quizQuestions = [];
    const shuffledFlashcards = [...flashcards].sort(() => 0.5 - Math.random()); // Shuffle flashcards
  
    // Limit to available flashcards if numQuestions is too high
    const actualNumQuestions = Math.min(numQuestions, shuffledFlashcards.length);
  
    for (let i = 0; i < actualNumQuestions; i++) {
      const correctCard = shuffledFlashcards[i];
      const options = [correctCard.answer]; // Start with the correct answer
  
      // Get incorrect options
      const incorrectOptionsPool = flashcards.filter(card => card.id !== correctCard.id)
                                               .map(card => card.answer);
  
      // Ensure enough unique incorrect options
      const uniqueIncorrectOptions = [...new Set(incorrectOptionsPool)].filter(
        (opt) => opt !== correctCard.answer
      );
  
      // Select random incorrect options
      while (options.length < numOptions && uniqueIncorrectOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * uniqueIncorrectOptions.length);
        const randomOption = uniqueIncorrectOptions.splice(randomIndex, 1)[0]; // Remove to prevent duplicates
        options.push(randomOption);
      }
  
      // Shuffle the options
      options.sort(() => 0.5 - Math.random());
  
      quizQuestions.push({
        id: correctCard.id, // Use flashcard ID as quiz question ID
        question: correctCard.question,
        options: options,
        correctAnswer: correctCard.answer,
      });
    }
  
    return quizQuestions;
  };