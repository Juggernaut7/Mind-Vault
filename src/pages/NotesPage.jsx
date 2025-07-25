// src/pages/NotesPage.jsx
import React, { useState } from 'react';
import useNotes from '../hooks/useNotes.js';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import AddNoteForm from '../components/Notes/AddNoteForm.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import useNoteStore from '../store/noteStore.js';
import Input from '../components/common/Input.jsx';
import { toast } from 'react-toastify'; // <-- Import toast

const NotesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notes, deleteNote, getAllTags } = useNotes();
  const { searchTerm, setSearchTerm, activeTags, toggleTag, setSortOrder } = useNoteStore();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) { // Still using confirm for now, as it's a critical action
      await deleteNote(id);
      toast.success('Note deleted successfully!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-electric mb-6">Your Knowledge Vault</h1>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <Button onClick={handleOpenModal} className="bg-electric hover:bg-electric-dark text-midnight">
          Add New Note
        </Button>

        <div className="flex items-center gap-3 flex-grow max-w-md">
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-midnight-700 border-steel-dark text-text-light placeholder-text-dark"
          />
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 rounded-md bg-midnight-700 text-text-light border border-steel-dark focus:border-electric focus:ring-electric focus:ring-1 outline-none transition-all duration-200"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="title">Sort by Title (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-text-light mb-3">Filter by Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {getAllTags.length > 0 ? (
            getAllTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200
                  ${activeTags.includes(tag)
                    ? 'bg-electric text-midnight hover:bg-electric-dark'
                    : 'bg-steel-dark text-text-light hover:bg-steel-light'
                  }`}
              >
                {tag}
              </button>
            ))
          ) : (
            <p className="text-text-dark">No tags available yet. Add some notes!</p>
          )}
        </div>
      </div>


      {notes.length === 0 ? (
        <p className="text-text-dark text-center text-lg mt-10">
          No notes found. Start by adding a new one!
        </p>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-midnight-800 p-6 rounded-lg shadow-xl border border-steel-dark hover:border-electric transition-all duration-300 relative group"
              >
                <h2 className="text-xl font-semibold text-electric mb-2">{note.title}</h2>
                <p className="text-text-dark text-sm mb-4 line-clamp-3">{note.description}</p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-steel-dark text-text-light text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {note.relatedTopics && note.relatedTopics.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-text-dark font-semibold">Related:</p>
                    <div className="flex flex-wrap gap-1">
                      {note.relatedTopics.map((topic, index) => (
                        <span key={index} className="text-xs text-steel-light">
                          {topic}{index < note.relatedTopics.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-text-dark opacity-80 mt-4">
                  Added: {formatDate(note.createdAt)}
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      onClick={() => handleDeleteNote(note.id)} // <-- Use new handler
                      className="p-1 rounded-full bg-transparent hover:bg-red-800 text-red-500 hover:text-white"
                      aria-label="Delete note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Knowledge">
        <AddNoteForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default NotesPage;