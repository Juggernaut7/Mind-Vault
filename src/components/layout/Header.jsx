// src/components/layout/Header.jsx
import React from 'react';
import { useAuth } from '../Auth/AuthProvider'; // To get the logged-in user
import { useTheme } from '../../hooks/useTheme'; // To potentially add theme toggle here later

const Header = () => {
  const { user } = useAuth(); // Get user details from auth context
  const { theme } = useTheme(); // Get current theme

  return (
    <header className="w-full bg-midnight-900 text-text-light p-4 shadow-lg border-b border-steel-dark flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        {/* You could add a logo or app title here, but it's already in the Sidebar */}
        <span className="text-xl font-semibold text-electric">MindVault</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <span className="text-text-light text-md">
            Welcome, <span className="font-bold text-electric">{user.username}</span>!
          </span>
        ) : (
          <span className="text-text-dark text-md">Guest</span>
        )}
        {/* Optional: Add a theme toggle here if you want it in the header */}
        {/*
        <button onClick={toggleTheme} className="px-3 py-1 rounded-md bg-steel-dark text-text-light text-sm hover:bg-steel-light transition-colors">
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        */}
      </div>
    </header>
  );
};

export default Header;