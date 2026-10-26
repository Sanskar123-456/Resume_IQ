import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, LogIn, UserPlus, AlertCircle, Eye, EyeOff, Check, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isValidGmail, isStrongPassword, PASSWORD_RULES } from '../utils/validators';

const AuthModal = ({ onClose, initialMode = 'login' }) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLoginMode) {
      const errs = {};
      if (name.trim().length < 2) errs.name = 'Please enter your full name';
      if (!isValidGmail(email)) errs.email = 'Invalid Email';
      if (!isStrongPassword(password)) errs.password = 'Password does not meet the requirements below';
      if (Object.keys(errs).length) {
        setFieldErrors(errs);
        setTouched({ name: true, email: true, password: true });
        return;
      }
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Live validation (register mode only)
  const emailInvalid = !isLoginMode && touched.email && email.length > 0 && !isValidGmail(email);
  const emailError = fieldErrors.email || (emailInvalid ? 'Invalid Email' : null);
  const nameError = fieldErrors.name;
  const passwordError = !isLoginMode && fieldErrors.password && !isStrongPassword(password) ? fieldErrors.password : null;
  const inputBase = 'w-full pl-9 pr-3 py-2.5 bg-[#F8F7FF] border rounded-xl text-xs text-[#1E1B4B] focus:outline-none focus:ring-2';
  const okCls = 'border-[#DDD6FE] focus:border-[#7C3AED] focus:ring-[#DDD6FE]';
  const badCls = 'border-rose-400 focus:border-rose-500 focus:ring-rose-100';
  const FieldError = ({ msg }) => msg ? (
    <p className="mt-1 text-[11px] font-medium text-rose-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{msg}</p>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[#DDD6FE] rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-[#7C3AED]/10 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#64748B] hover:text-[#1E1B4B] hover:bg-[#F5F3FF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#1E1B4B]">
            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            {isLoginMode ? 'Sign in to access your resume analyses and history' : 'Use your Gmail address and a strong password to get started'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-medium text-[#1E1B4B] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFieldErrors((f) => ({ ...f, name: null })); }}
                  placeholder="John Doe"
                  className={`${inputBase} ${nameError ? badCls : okCls}`}
                />
              </div>
              <FieldError msg={nameError} />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#1E1B4B] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: null })); }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder={isLoginMode ? 'you@gmail.com' : 'yourname@gmail.com'}
                className={`${inputBase} ${emailError ? badCls : okCls}`}
              />
            </div>
            <FieldError msg={emailError} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1E1B4B] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: null })); }}
                onFocus={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="••••••••"
                className={`${inputBase} pr-10 ${passwordError ? badCls : okCls}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#7C3AED] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError msg={passwordError} />

            {!isLoginMode && touched.password && (
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 p-3 rounded-xl bg-[#F8F7FF] border border-[#DDD6FE]">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li key={rule.id} className={`flex items-center gap-1.5 text-[11px] ${ok ? 'text-emerald-700' : 'text-[#64748B]'}`}>
                      {ok ? <Check className="w-3 h-3 text-emerald-600" /> : <Circle className="w-3 h-3 text-[#CBD5E1]" />}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-[#7C3AED]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoginMode ? (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Register Account
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
              setFieldErrors({});
              setTouched({});
            }}
            className="text-xs text-[#7C3AED] hover:text-[#6D28D9] hover:underline font-medium"
          >
            {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
