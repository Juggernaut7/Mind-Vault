// src/hooks/useFlashcards.js
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dbConfig.js';
import { generateFlashcards } from '../lib/flashcardGenerator.js'; // Import our generator

const useFlashcards = () => {
  const flashcards = useLiveQuery(() => db.flashcards.toArray(), [], []);

  // Function to add a single flashcard (might be used for manual additions later)
  const addFlashcard = async (flashcard) => {
    try {
      await db.flashcards.add({ ...flashcard, createdAt: new Date() });
      console.log('Flashcard added:', flashcard.question);
    } catch (error) {
      console.error('Error adding flashcard:', error);
    }
  };

  // Function to generate and save flashcards for a specific note
  const generateAndSaveFlashcardsForNote = async (note) => {
    if (!note || !note.id) {
      console.warn('Cannot generate flashcards: invalid note object provided.');
      return;
    }

    // Optional: Delete existing flashcards for this note before regenerating
    // This prevents duplicates if a note is edited and regenerated.
    await db.flashcards.where('sourceNoteId').equals(note.id).delete();

    const generated = generateFlashcards(note);
    if (generated.length > 0) {
      // Add sourceNoteId and createdAt to each generated flashcard
      const flashcardsToAdd = generated.map(fc => ({
        ...fc,
        sourceNoteId: note.id,
        createdAt: new Date(),
      }));
      try {
        await db.flashcards.bulkAdd(flashcardsToAdd);
        console.log(`Generated and saved ${flashcardsToAdd.length} flashcards for note: "${note.title}"`);
      } catch (error) {
        console.error('Error bulk adding flashcards:', error);
      }
    } else {
      console.log(`No flashcards generated for note: "${note.title}"`);
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await db.flashcards.delete(id);
      console.log('Flashcard deleted:', id);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const deleteFlashcardsByNoteId = async (noteId) => {
    try {
      await db.flashcards.where('sourceNoteId').equals(noteId).delete();
      console.log(`Flashcards for note ${noteId} deleted.`);
    } catch (error) {
      console.error(`Error deleting flashcards for note ${noteId}:`, error);
    }
  };


  return {
    flashcards,
    addFlashcard,
    generateAndSaveFlashcardsForNote,
    deleteFlashcard,
    deleteFlashcardsByNoteId,
  };
};

export default useFlashcards;