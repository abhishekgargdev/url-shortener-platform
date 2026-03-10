import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { Lock, Mail } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 border-t-4 border-blue-500">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full bg-slate-900 border border-slate-700 text-white rounded outline-none focus:border-blue-500 pl-10 pr-3 py-2 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded outline-none focus:border-blue-500 pl-10 pr-3 py-2 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Log in</Link>
        </div>
      </div>
    </div>
  );
}
