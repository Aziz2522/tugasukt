import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Lightbulb, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Request
        const { data } = await api.post('/auth/login', formData);
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        // Register Request (default role 'user')
        await api.post('/auth/register', { ...formData, role: 'user' });
        // Auto login after register
        const { data } = await api.post('/auth/login', formData);
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-zinc-950">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Auth Card */}
      <div className="w-full max-w-md p-8 glass-card relative z-10 shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-zinc-900/80 rounded-2xl mb-4 border border-zinc-700/50 shadow-[var(--shadow-glow-amber)]">
            <Lightbulb className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Lumina<span className="text-amber-500">Store</span>
          </h1>
          <p className="text-sm text-zinc-400">
            {isLogin ? 'Welcome back, please log in.' : 'Create your account to start shopping.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Username</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text"
                required
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password"
                required
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[var(--shadow-glow-amber)] hover:shadow-lg disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : isLogin ? (
              <><LogIn className="w-5 h-5" /> Sign In</>
            ) : (
              <><UserPlus className="w-5 h-5" /> Create Account</>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center text-sm text-zinc-400 font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-500 hover:text-amber-400 hover:underline transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;
