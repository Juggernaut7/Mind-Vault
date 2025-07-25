// src/config/dbConfig.js
import Dexie from 'dexie';

export const db = new Dexie('MindVaultDB');

// IMPORTANT: Increment the version number if you change the schema (e.g., add/remove/change indexed properties)
db.version(2).stores({ // <-- Changed version from 1 to 2
  notes: '++id, title, description, tags, relatedTopics, createdAt',
  flashcards: '++id, sourceNoteId, question, answer, createdAt', // <-- Changed 'noteId' to 'sourceNoteId' and indexed it
  users: '++id, username, password',
  // Add other tables as needed (e.g., quizzes, folders)
});

// Add an upgrade function for version 2 if you have existing data from version 1
// This is crucial if users already have data with the old schema.
db.version(2).upgrade(async (tx) => {
  // If you had data in 'flashcards' from version 1 that used 'noteId'
  // and now you want to migrate it to 'sourceNoteId', you'd do it here.
  // For simplicity, if you're starting fresh or don't care about old flashcards,
  // just changing the schema is enough.
  // If 'noteId' was never used, and 'sourceNoteId' is new, no migration is strictly needed for existing data.
  // However, if you previously saved flashcards with a 'noteId' field and now want to query by 'sourceNoteId',
  // you might need to iterate through existing flashcards and add 'sourceNoteId' if 'noteId' exists.
  // Example (if you had data with 'noteId' that needs to become 'sourceNoteId'):
  // await tx.flashcards.toCollection().modify(flashcard => {
  //   if (flashcard.noteId && !flashcard.sourceNoteId) {
  //     flashcard.sourceNoteId = flashcard.noteId;
  //     delete flashcard.noteId; // Optional: remove the old property
  //   }
  // });
  console.log("Database upgraded to version 2. 'sourceNoteId' is now indexed in flashcards.");
});


// Seed data (optional, for initial testing)
db.on('ready', async () => {
  // Only seed if notes table is empty
  if ((await db.notes.count()) === 0) {
    await db.notes.bulkAdd([
      {
        title: 'Introduction to React Hooks',
        description: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.',
        tags: ['React', 'Frontend', 'JavaScript'],
        relatedTopics: ['useState', 'useEffect'],
        createdAt: new Date(),
      },
      {
        title: 'Zustand Basics',
        description: 'Zustand is a small, fast, and scalable bear-necessities state-management solution using simplified flux principles.',
        tags: ['React', 'State Management'],
        relatedTopics: ['Flux', 'Redux'],
        createdAt: new Date(),
      },
      {
        title: 'CSS Grid Layout',
        description: 'CSS Grid Layout is a two-dimensional layout system for the web.',
        tags: ['CSS', 'Layout'],
        relatedTopics: ['Flexbox'],
        createdAt: new Date(),
      },
    ]);
    console.log('MindVault seeded with initial notes!');
  }
  // If you want to re-seed flashcards after schema change, you might clear them first
  // if ((await db.flashcards.count()) > 0) {
  //   await db.flashcards.clear();
  //   console.log('Cleared existing flashcards for re-generation.');
  // }
});

// To expose db for easy debugging in console (optional)
if (import.meta.env.DEV) {
  window.db = db;
}
