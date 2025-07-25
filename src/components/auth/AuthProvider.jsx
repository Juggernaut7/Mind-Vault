// src/components/auth/AuthProvider.jsx
import React, { createContext, useContext } from 'react';
import useAuthStore from '../../store/authStore.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authState = useAuthStore(); // Access zustand store

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};