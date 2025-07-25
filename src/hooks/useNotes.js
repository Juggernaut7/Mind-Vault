// src/hooks/useNotes.js
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../config/dbConfig.js';
import useNoteStore from '../store/noteStore.js';
import useFlashcards from './useFlashcards.js'; // <-- NEW: Import useFlashcards hook

const useNotes = () => {
  const { searchTerm, activeTags, sortOrder } = useNoteStore();
  const { deleteFlashcardsByNoteId } = useFlashcards(); // <-- NEW: Get delete function

  const allNotes = useLiveQuery(() => db.notes.toArray(), [], []);

  const filteredAndSortedNotes = React.useMemo(() => {
    // ... (rest of filtering and sorting logic, no change here)
    if (!allNotes) return [];

    let filtered = allNotes;

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        note.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
      );
    }

    // Apply active tags filter (only show notes containing ALL active tags)
    if (activeTags && activeTags.length > 0) {
      filtered = filtered.filter(note =>
        activeTags.every(activeTag => note.tags && note.tags.includes(activeTag))
      );
    }

    // Apply sorting
    let sorted = [...filtered];
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [allNotes, searchTerm, activeTags, sortOrder]);


  const addNote = async (note) => {
    try {
      const processedTags = Array.isArray(note.tags)
        ? [...new Set(note.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag))]
        : [];
      const processedRelatedTopics = Array.isArray(note.relatedTopics)
        ? [...new Set(note.relatedTopics.map(topic => topic.trim()).filter(topic => topic))]
        : [];

      // Add the note and get its ID
      const newNoteId = await db.notes.add({
        ...note,
        tags: processedTags,
        relatedTopics: processedRelatedTopics,
        createdAt: new Date(),
      });
      console.log('Note added successfully:', note.title, 'ID:', newNoteId);

      // Immediately generate and save flashcards for the new note
      // Retrieve the newly added note with its ID from the DB for generation
      const newlyAddedNote = await db.notes.get(newNoteId);
      if (newlyAddedNote) {
        await generateFlashcardsForNote(newlyAddedNote); // Use the correct function name
      }

    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Function to get all unique tags from notes for filtering
  const getAllTags = React.useMemo(() => {
    if (!allNotes) return [];
    const tags = new Set();
    allNotes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [allNotes]);


  const updateNote = async (id, updates) => {
    try {
      await db.notes.update(id, updates);
      console.log('Note updated successfully:', id);
      // OPTIONAL: Regenerate flashcards if description/title changed
      const updatedNote = await db.notes.get(id);
      if (updatedNote) {
         // You might want a more sophisticated check here to only regenerate if content changes
         await generateFlashcardsForNote(updatedNote);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await db.notes.delete(id);
      console.log('Note deleted successfully:', id);
      // NEW: Delete associated flashcards when a note is deleted
      await deleteFlashcardsByNoteId(id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Alias for better naming within this hook context
  const generateFlashcardsForNote = useFlashcards().generateAndSaveFlashcardsForNote;


  return {
    notes: filteredAndSortedNotes,
    addNote,
    updateNote,
    deleteNote,
    getAllTags,
    generateFlashcardsForNote, // Expose for manual trigger if desired
  };
};

export default useNotes;