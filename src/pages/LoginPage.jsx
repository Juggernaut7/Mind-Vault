// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { db } from '../config/dbConfig.js';
import { toast } from 'react-toastify'; // <-- Import toast

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      toast.error('Please enter both username and password.'); // <-- Changed from alert()
      return;
    }

    try {
      const user = await db.users.where('username').equalsIgnoreCase(username).first();

      if (user && user.password === password) {
        login(user.username);
        toast.success(`Welcome back, ${user.username}!`); // <-- Success toast
        navigate('/dashboard');
      } else {
        toast.error('Invalid username or password.'); // <-- Error toast
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred during login. Please try again.'); // <-- Error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-midnight text-text-light p-4 relative z-10">
      <div className="bg-midnight-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-steel-dark">
        <h2 className="text-3xl font-bold mb-6 text-center text-electric">MindVault Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="username">
              Username:
            </label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-text-light text-sm font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {/* Removed direct error display here as toast handles it */}
          <Button type="submit" className="w-full bg-electric hover:bg-electric-dark">
            Login
          </Button>
        </form>
        <p className="text-center text-text-dark mt-4">
          Don't have an account? <a href="/register" className="text-electric hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;