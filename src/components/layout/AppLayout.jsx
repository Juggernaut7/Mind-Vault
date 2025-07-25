// src/components/layout/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Used for nested routes
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import ParticleBackground from '../threejs/ParticleBackground.jsx'; // Our cool particle effect

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-midnight text-text-light relative">
      {/* Particle Background - positioned absolutely behind everything */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Main content wrapper, relative to allow z-index positioning for UI elements */}
      <div className="relative z-10 flex flex-grow">
        <Sidebar /> {/* Sidebar on the left */}

        <div className="flex-1 flex flex-col">
          <Header /> {/* Header at the top of the main content area */}
          <main className="flex-1 p-6 overflow-auto custom-scrollbar">
            {/* The Outlet renders the matched child route component (e.g., Dashboard, Notes, etc.) */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;