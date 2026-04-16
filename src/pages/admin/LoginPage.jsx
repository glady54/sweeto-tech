import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAdminAuth();
  const { t } = useAdminLocale();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = login(username, password);

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-none p-10 border border-white dark:border-slate-800">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2 tracking-tight">
              SWEETO HUBS
            </h1>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('login')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                {t('username')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white rounded-2xl bg-gray-50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter admin username"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">
                {t('password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-200 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white rounded-2xl bg-gray-50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 dark:shadow-none translate-y-0 hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-3 transition-transform group-hover:translate-x-1" />
                    {t('login')}
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <div className="inline-block p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tighter mb-1">Testing Credentials</p>
              <code className="text-xs text-amber-600 dark:text-amber-500 font-mono">admin / admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
