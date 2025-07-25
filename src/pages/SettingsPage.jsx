// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme'; // Import our theme hook
import { useAuth } from '../components/auth/AuthProvider'; // To show current user
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { db } from '../config/dbConfig'; // For potential future password change

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function
  const { user } = useAuth(); // Get current logged-in user

  // State for potential password change form (future feature)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeMessage('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeMessage('All password fields are required.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeMessage('New password must be at least 6 characters long.');
      return;
    }

    try {
      // In a real app, this would involve server-side validation and hashing
      // For Dexie, we'll simulate by checking the current stored password
      const currentUserInDb = await db.users.where('username').equalsIgnoreCase(user.username).first();

      if (currentUserInDb && currentUserInDb.password === currentPassword) {
        // Update password (again, in real app, hash this!)
        await db.users.update(currentUserInDb.id, { password: newPassword });
        setPasswordChangeMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeMessage('Incorrect current password.');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordChangeMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-electric mb-6">Settings</h1>

      <div className="bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark mb-8">
        <h2 className="text-2xl font-semibold text-text-light mb-4 border-b border-steel-dark pb-2">
          General Settings
        </h2>
        <p className="text-text-dark mb-4">Logged in as: <span className="text-electric">{user?.username || 'Guest'}</span></p>

        <div className="flex items-center justify-between mb-4">
          <label htmlFor="theme-toggle" className="text-text-light text-lg">
            Theme: <span className="capitalize text-electric">{theme}</span>
          </label>
          <Button onClick={toggleTheme} className="bg-steel hover:bg-steel-light text-text-light">
            Toggle Theme to {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>

        {/* You can add more general settings here */}
      </div>

      <div className="bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark">
        <h2 className="text-2xl font-semibold text-text-light mb-4 border-b border-steel-dark pb-2">
          Account Settings
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="current-password">
              Current Password:
            </label>
            <Input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="new-password">
              New Password:
            </label>
            <Input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="confirm-new-password">
              Confirm New Password:
            </label>
            <Input
              type="password"
              id="confirm-new-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          {passwordChangeMessage && <p className="text-sm text-center" style={{ color: passwordChangeMessage.includes('successful') ? '#4ade80' : '#ef4444' }}>{passwordChangeMessage}</p>}
          <Button type="submit" className="w-full bg-violet-glow hover:bg-violet-glow-dark text-text-light">
            Change Password
          </Button>
        </form>
      </div>

      {/* Add more settings sections like data export/import, notifications, etc. */}
    </div>
  );
};

export default SettingsPage;