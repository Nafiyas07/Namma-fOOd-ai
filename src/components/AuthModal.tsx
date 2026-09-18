import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, loginAsDemo } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await register(name, email, password, confirmPassword);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginAsDemo();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to login with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1E1D]/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        id="auth-modal-card" 
        className="relative w-full max-w-md bg-white border border-[#E8E4DC] rounded-3xl p-8 luxury-shadow animate-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          id="auth-modal-close-btn"
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-[#6E8576] hover:text-[#1C1E1D] hover:bg-[#FAF8F5] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#114232]/20 bg-[#FAF8F5] mx-auto mb-3 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-[#114232] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#114232]" />
            </div>
          </div>
          <h2 className="font-editorial text-2xl font-semibold text-[#1C1E1D]">
            {authModalTab === 'login' ? 'Welcome to Namma fOOd-AI' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#6E8576] mt-1">
            {authModalTab === 'login'
              ? 'Access your food analyses and personalized insights'
              : 'Join to track visual quality and food safety insights across meals'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-[#F5F2EB] p-1 mb-6 border border-[#E8E4DC]">
          <button
            id="tab-btn-login"
            type="button"
            onClick={() => {
              setErrorMessage('');
              openAuthModal('login');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-[#114232] shadow-xs'
                : 'text-[#6E8576] hover:text-[#1C1E1D]'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-btn-register"
            type="button"
            onClick={() => {
              setErrorMessage('');
              openAuthModal('register');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-[#114232] shadow-xs'
                : 'text-[#6E8576] hover:text-[#1C1E1D]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
                Full Name
              </label>
              <input
                id="auth-input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Nafiya Anjum"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-sm text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
              Email Address
            </label>
            <input
              id="auth-input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-sm text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
              Password
            </label>
            <input
              id="auth-input-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-sm text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232] transition-colors"
            />
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#2C302E] mb-1.5">
                Confirm Password
              </label>
              <input
                id="auth-input-confirm-password"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF8F5] text-sm text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#114232]/20 focus:border-[#114232] transition-colors"
              />
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#114232] text-white text-sm font-semibold tracking-wide hover:bg-[#0E3B2C] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 mt-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{authModalTab === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        {/* Zero-friction Demo Button */}
        <div className="mt-6 pt-5 border-t border-[#E8E4DC]">
          <button
            id="demo-login-btn"
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#E8E4DC] bg-[#F5F2EB] hover:bg-[#EAE5DA] text-[#114232] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Instant Demo Consumer Sign-In</span>
          </button>
          <p className="text-[11px] text-center text-[#8A9A86] mt-2">
            Explore with pre-seeded assessments and historical data
          </p>
        </div>
      </div>
    </div>
  );
};
