import React from 'react';
import { Users, Home, User, MessageCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationSystem from './NotificationSystem';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: 'dashboard' | 'browse' | 'profile' | 'swaps' | 'admin') => void;
  onSwapAccepted?: (swap: any) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, onSwapAccepted }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'swaps', label: 'Swaps', icon: MessageCircle },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm shadow-2xl border-b border-gray-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SkillSwap
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentPage(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === id
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationSystem onSwapAccepted={onSwapAccepted} />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden md:block text-gray-200 font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 border-t border-gray-700/50 mt-4 pt-4">
          <nav className="flex space-x-2 overflow-x-auto">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  currentPage === id
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;