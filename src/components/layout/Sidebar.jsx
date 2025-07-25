// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthProvider.jsx';
import Button from '../common/Button.jsx';

// Import specific icons from react-icons/md
import {
  MdDashboard,
  MdNotes,
  MdLightbulb, // For Flashcards (brain/lightbulb idea)
  MdAccountTree, // For Mind Map (tree structure)
  MdQuiz,
  MdSettings,
  MdLogout // For Logout button
} from 'react-icons/md';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard /> },
    { name: 'My Notes', path: '/notes', icon: <MdNotes /> },
    { name: 'Flashcards', path: '/flashcards', icon: <MdLightbulb /> },
    { name: 'Mind Map', path: '/mindmap', icon: <MdAccountTree /> },
    { name: 'Quizzes', path: '/quiz', icon: <MdQuiz /> },
    { name: 'Settings', path: '/settings', icon: <MdSettings /> },
  ];

  return (
    <motion.div
      className="w-64 bg-midnight-800 text-text-light flex flex-col p-6 shadow-lg border-r border-steel-dark"
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex items-center justify-center mb-10 mt-2">
        <h1 className="text-3xl font-bold text-electric">MindVault</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg text-text-light font-medium transition-all duration-200
                   ${isActive
                      ? 'bg-electric text-midnight shadow-md'
                      : 'hover:bg-steel-dark hover:text-electric'
                   }`
                }
              >
                <span className="text-xl">{item.icon}</span> {/* Render the React Icon component */}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8">
        <Button
          onClick={logout}
          className="w-full bg-violet-glow hover:bg-violet-glow-dark text-text-light flex items-center justify-center gap-2"
        >
          <MdLogout className="text-xl" /> {/* Logout icon */}
          Logout
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;