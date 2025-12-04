import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { PasswordInput } from '../components/common/FormComponents';
import { pageTransitionVariants, slideUpVariants } from '../config/animations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error?.message || json.error || 'Error registering');
      const token = json.data?.token || json.token;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', name);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : 'Error registering';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-cyan hover:text-cyan/80 mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Back to Login</span>
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={slideUpVariants}
          custom={0}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-12 h-12 text-cyan" />
            <h1 className="text-white text-3xl sm:text-4xl font-black">CryptoAlert</h1>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Register to start tracking cryptocurrencies and create alerts.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-gradient-to-br from-slate-900 to-black rounded-xl p-6 sm:p-8 backdrop-blur-lg border-2 border-cyan/60 shadow-2xl shadow-cyan/10"
          variants={slideUpVariants}
          custom={1}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-white mb-2 font-semibold text-sm">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-cyan/50 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/80 transition-all placeholder-gray-500"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white mb-2 font-semibold text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-slate-900/30 text-white rounded-lg border border-cyan/30 focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-all placeholder-gray-500"
                required
              />
            </div>

            {/* Password Field */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              label="Password"
              required
              minLength={6}
            />

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan to-blue-500 text-black py-3 rounded-lg font-bold hover:from-cyan/90 hover:to-blue-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan/30 text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '⏳ Creating...' : '✓ Create Account'}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-gray-500 mt-6 text-xs sm:text-sm"
          variants={slideUpVariants}
          custom={2}
        >
          Price data provided by CoinGecko
        </motion.p>
      </motion.div>
    </div>
  );
}
