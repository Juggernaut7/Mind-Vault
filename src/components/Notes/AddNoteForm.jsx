// src/components/Notes/AddNoteForm.jsx
import React, { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import useNotes from '../../hooks/useNotes.js';
import { toast } from 'react-toastify'; // <-- Import toast

const AddNoteForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [relatedTopicsInput, setRelatedTopicsInput] = useState('');

  const { addNote } = useNotes();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const relatedTopicsArray = relatedTopicsInput.split(',').map(topic => topic.trim()).filter(topic => topic !== '');

    if (!title || !description) {
      toast.error('Title and Description are required!'); // <-- Changed from alert()
      return;
    }

    const newNote = {
      title,
      description,
      tags: tagsArray,
      relatedTopics: relatedTopicsArray,
    };

    await addNote(newNote);
    toast.success('Note added successfully!'); // <-- Success toast
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="note-title" className="block text-text-light text-sm font-bold mb-2">
          Title
        </label>
        <Input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Understanding React Context"
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="note-description" className="block text-text-light text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          id="note-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed explanation of the concept..."
          rows="5"
          className="w-full p-2 rounded-md bg-midnight-700 text-text-light border border-steel-dark focus:border-electric focus:ring-electric focus:ring-1 outline-none transition-all duration-200"
        ></textarea>
      </div>
      <div>
        <label htmlFor="note-tags" className="block text-text-light text-sm font-bold mb-2">
          Tags (comma-separated)
        </label>
        <Input
          id="note-tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., react, state management, hooks"
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="note-related-topics" className="block text-text-light text-sm font-bold mb-2">
          Related Topics (comma-separated)
        </label>
        <Input
          id="note-related-topics"
          type="text"
          value={relatedTopicsInput}
          onChange={(e) => setRelatedTopicsInput(e.target.value)}
          placeholder="e.g., Redux, Zustand, useContext"
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-electric hover:bg-electric-dark">
        Add Note
      </Button>
    </form>
  );
};

export default AddNoteForm;