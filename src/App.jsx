// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Global Components/Providers
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts & Authentication
import AppLayout from './components/layout/AppLayout.jsx';
import PrivateRoute from './components/auth/PrivateRoute'; // Corrected path casing
// import PrivateRoute from './components/Auth/PrivateRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx'; // Our new landing page
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import MindMapPage from './pages/MindMapPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';


function App() {
  return (
    <>
      <Routes>
        {/* Landing Page - Accessible to everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - rendered inside AppLayout and guarded by PrivateRoute */}
        <Route element={<PrivateRoute />}> {/* PrivateRoute checks authentication */}
          <Route path="/" element={<AppLayout />}> {/* AppLayout provides consistent UI (Header, Sidebar, Background) */}
            {/* Nested routes will be rendered within AppLayout's <Outlet /> */}
            {/* Removed the index route here as '/' is now handled by LandingPage */}
            <Route path="dashboard" element={<DashboardPage />} /> {/* No leading slash for nested routes */}
            <Route path="notes" element={<NotesPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="mindmap" element={<MindMapPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback for any unmatched routes - redirects to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
