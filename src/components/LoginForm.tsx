import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials or account banned');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="text-center mb-6">
        <LogIn className="mx-auto text-cyan-400 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-gray-300">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-cyan-500/25"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
        <p className="text-sm text-gray-300 mb-2">Demo Accounts:</p>
        <div className="text-xs space-y-1">
          <div className="text-gray-400">Admin: admin@demo.com / password</div>
          <div className="text-gray-400">User: user@demo.com / password</div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;