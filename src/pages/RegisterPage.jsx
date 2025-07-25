// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { db } from '../config/dbConfig.js';
import { toast } from 'react-toastify'; // <-- Import toast

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [error, setError] = useState(''); // We'll rely on toast for errors now
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // setError(''); // No need to clear local error state if using toast

    if (!username || !password || !confirmPassword) {
      toast.error('All fields are required.'); // <-- Changed from setError
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.'); // <-- Changed from setError
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.'); // <-- Changed from setError
      return;
    }

    try {
      const existingUser = await db.users.where('username').equalsIgnoreCase(username).first();
      if (existingUser) {
        toast.error('Username already taken. Please choose another.'); // <-- Changed from setError
        return;
      }

      await db.users.add({ username: username, password: password });
      toast.success('Registration successful! You can now log in.'); // <-- Success toast
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('An error occurred during registration. Please try again.'); // <-- Error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-midnight text-text-light p-4 relative z-10">
      <div className="bg-midnight-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-steel-dark">
        <h2 className="text-3xl font-bold mb-6 text-center text-electric">Register for MindVault</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="reg-username">
              Username:
            </label>
            <Input
              type="text"
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="reg-password">
              Password:
            </label>
            <Input
              type="password"
              id="reg-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm Password:
            </label>
            <Input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          {/* Removed direct error display here as toast handles it */}
          <Button type="submit" className="w-full bg-electric hover:bg-electric-dark">
            Register
          </Button>
        </form>
        <p className="text-center text-text-dark mt-4">
          Already have an account? <a href="/login" className="text-electric hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;