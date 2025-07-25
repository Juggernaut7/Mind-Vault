/**
 * Generates flashcards from a given note.
 * This is our "mock AI" for creating Q&A pairs.
 * @param {object} note - The note object { title, description, tags, relatedTopics }
 * @returns {Array<object>} An array of flashcard objects: [{ question: string, answer: string }]
 */
export const generateFlashcards = (note) => {
    const flashcards = [];
  
    // Rule 1: Title as question, description as answer
    if (note?.title && note?.description) {
      flashcards.push({
        question: `What is "${note.title.trim()}"?`,
        answer: note.description.trim(),
      });
    }
  
    // Rule 2: Basic keyword definitions (example: looks for "X is Y")
    const definitionRegex = /(\w+)\s+is\s+(.+?)(?=\.|\n|$)/gi;
    let match;
    while ((match = definitionRegex.exec(note?.description || '')) !== null) {
      const term = match[1].trim();
      const definition = match[2].trim();
      if (term.length > 2 && definition.length > 5) {
        flashcards.push({
          question: `What is ${term}?`,
          answer: definition,
        });
      }
    }
  
    // Rule 3: For each tag, ask what it means in context of the note
    if (note?.tags && Array.isArray(note.tags)) {
      note.tags.forEach(tag => {
        if (tag && !flashcards.some(fc => fc.question.toLowerCase().includes(tag.toLowerCase()))) {
          flashcards.push({
            question: `Explain "${tag.trim()}" in the context of "${note.title.trim()}"?`,
            answer: note.description?.trim() || 'No description available',
          });
        }
      });
    }
  
    // Deduplicate flashcards based on question
    const uniqueFlashcards = [];
    const questionsSeen = new Set();
    for (const card of flashcards) {
      if (card.question && !questionsSeen.has(card.question.toLowerCase())) {
        uniqueFlashcards.push(card);
        questionsSeen.add(card.question.toLowerCase());
      }
    }
  
    console.log('Generated flashcards:', uniqueFlashcards); // Debug log
    return uniqueFlashcards;
  };