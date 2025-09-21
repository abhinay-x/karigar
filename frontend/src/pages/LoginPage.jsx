import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, Play, Sparkles, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const { login, loading, enableDemoMode } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('artisan@example.com');
  const [password, setPassword] = useState('password');

  const onSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password, redirect: new URLSearchParams(location.search).get('redirect') });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Sign in to KalaAI</h1>
          <p className="text-gray-600 text-sm">Welcome back! Continue your artisan journey.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Mode Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>New to KalaAI?</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Create an account to start your artisan journey
            </p>
          </div>

          <Link
            to="/signup"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </Link>

          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Want to explore first?</span>
            </div>
            <p className="text-xs text-gray-400">
              Try all features with demo mode - no signup required
            </p>
          </div>

          <button
            onClick={enableDemoMode}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Try Demo Mode
          </button>

          <div className="mt-3 text-xs text-center text-gray-400">
            Experience KalaAI as <strong>Rajesh Kumar</strong>, a pottery master from Jaipur
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
