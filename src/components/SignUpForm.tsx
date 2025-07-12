import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    role: 'user' as 'user' | 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const success = await signup(formData);
    if (!success) {
      setError('Email already exists');
    }
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
      <div className="text-center mb-6">
        <UserPlus className="mx-auto text-cyan-400 mb-2" size={32} />
        <h2 className="text-2xl font-bold text-white">Join SkillSwap</h2>
        <p className="text-gray-300">Create your account to start swapping skills</p>
      </div>

      {/* Account Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'user' })}
            className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all duration-300 ${
              formData.role === 'user'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-gray-600 hover:border-gray-500 text-gray-300'
            }`}
          >
            <User size={20} />
            <span className="font-medium">User</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'admin' })}
            className={`flex items-center justify-center space-x-2 p-3 border-2 rounded-lg transition-all duration-300 ${
              formData.role === 'admin'
                ? 'border-red-500 bg-red-500/10 text-red-400'
                : 'border-gray-600 hover:border-gray-500 text-gray-300'
            }`}
          >
            <Shield size={20} />
            <span className="font-medium">Admin</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {formData.role === 'admin' 
            ? 'Admin accounts have moderation and management privileges'
            : 'Regular user account for skill swapping'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {formData.role === 'admin' ? 'Department/Role (Optional)' : 'Location (Optional)'}
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            placeholder={formData.role === 'admin' ? 'e.g., Content Moderation, User Support' : 'City, Country'}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 shadow-lg ${
            formData.role === 'admin'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-red-500/25'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 focus:ring-cyan-500 shadow-cyan-500/25'
          }`}
        >
          {isLoading ? 'Creating Account...' : `Create ${formData.role === 'admin' ? 'Admin' : 'User'} Account`}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;