// src/pages/FlashcardsPage.jsx
import React, { useState, useEffect } from 'react';
import useFlashcards from '../hooks/useFlashcards.js';
import useNotes from '../hooks/useNotes.js'; // To manually generate from notes if needed
import Button from '../components/common/Button.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardsPage = () => {
  const { flashcards, deleteFlashcard, generateAndSaveFlashcardsForNote } = useFlashcards();
  const { notes } = useNotes(); // Get all notes to potentially trigger generation

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState('');

  // Reset state when flashcards change or page loads
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    if (flashcards && flashcards.length === 0) {
      setMessage("No flashcards yet. Add some notes and they'll appear here!");
    } else {
      setMessage('');
    }
  }, [flashcards]);

  const handleNextCard = () => {
    setIsFlipped(false); // Flip back to question side
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false); // Flip back to question side
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleDeleteCurrentCard = async () => {
    if (flashcards[currentCardIndex]) {
      await deleteFlashcard(flashcards[currentCardIndex].id);
      // The `useLiveQuery` in useFlashcards will automatically re-render
      // No need to manually adjust index here, useEffect handles reset.
    }
  };

  const handleGenerateAllFlashcards = async () => {
    if (notes.length === 0) {
      setMessage("No notes to generate flashcards from. Please add some notes first!");
      return;
    }
    setMessage("Generating flashcards...");
    for (const note of notes) {
      await generateAndSaveFlashcardsForNote(note);
    }
    setMessage("Flashcards generated!");
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };


  const currentCard = flashcards?.[currentCardIndex];

  return (
    <div className="p-6 flex flex-col items-center justify-start min-h-full">
      <h1 className="text-4xl font-bold text-electric mb-8">Flashcards</h1>

      <div className="w-full max-w-2xl bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark flex flex-col items-center justify-center min-h-[350px] relative">
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-text-light mb-4 absolute top-4 left-1/2 -translate-x-1/2 bg-steel-dark px-4 py-2 rounded-lg text-sm"
          >
            {message}
          </motion.p>
        )}

        {flashcards && flashcards.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard?.id || 'empty'} // Key ensures re-animation on card change
                initial={{ rotateY: 0, opacity: 0, x: 100 }}
                animate={{ rotateY: isFlipped ? 180 : 0, opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full min-h-[200px] flex items-center justify-center text-center perspective-1000"
                style={{ transformStyle: "preserve-3d" }}
                onClick={handleFlipCard}
              >
                <div
                  className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-2xl font-semibold text-electric cursor-pointer"
                  style={{ transform: "rotateY(0deg)" }}
                >
                  {currentCard.question}
                </div>
                <div
                  className="absolute w-full h-full backface-hidden flex items-center justify-center p-4 text-xl text-text-light cursor-pointer"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {currentCard.answer}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8 w-full">
              <Button onClick={handlePrevCard} className="bg-steel hover:bg-steel-light text-text-light">
                Previous
              </Button>
              <Button onClick={handleFlipCard} className="bg-electric hover:bg-electric-dark text-midnight">
                Flip Card
              </Button>
              <Button onClick={handleNextCard} className="bg-steel hover:bg-steel-light text-text-light">
                Next
              </Button>
            </div>
            <p className="text-text-dark text-sm mt-4">
              Card {currentCardIndex + 1} of {flashcards.length}
            </p>
            <Button
              onClick={handleDeleteCurrentCard}
              className="mt-4 px-3 py-1 bg-red-700 hover:bg-red-800 text-text-light text-sm"
            >
              Delete Current Card
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-text-dark text-lg mb-4">No flashcards loaded.</p>
            <Button onClick={handleGenerateAllFlashcards} className="bg-violet-glow hover:bg-violet-glow-dark text-text-light">
              Generate All From Notes
            </Button>
            <p className="text-text-dark text-sm mt-2">
              (This will generate flashcards from all your existing notes.)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsPage;