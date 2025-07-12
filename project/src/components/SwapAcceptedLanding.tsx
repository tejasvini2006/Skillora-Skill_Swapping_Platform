import React, { useEffect, useState } from 'react';
import { CheckCircle, MessageCircle, Calendar, BookOpen, Star, Sparkles, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface SwapAcceptedLandingProps {
  swap: any;
  onClose: () => void;
  onStartChat: () => void;
}

const SwapAcceptedLanding: React.FC<SwapAcceptedLandingProps> = ({ swap, onClose, onStartChat }) => {
  const { user } = useAuth();
  const { users } = useData();
  const [showConfetti, setShowConfetti] = useState(true);

  const otherUser = users.find(u => u.id === (swap.fromUserId === user?.id ? swap.toUserId : swap.fromUserId));

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const tips = [
    {
      icon: Calendar,
      title: "Schedule Your Sessions",
      description: "Coordinate your availability and set up regular learning sessions"
    },
    {
      icon: BookOpen,
      title: "Prepare Materials",
      description: "Gather resources, tutorials, and examples to share with each other"
    },
    {
      icon: MessageCircle,
      title: "Stay Connected",
      description: "Use the chat feature to communicate and track your progress"
    },
    {
      icon: Star,
      title: "Give Feedback",
      description: "Rate your experience when you complete the skill swap"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className={`w-2 h-2 ${
                  ['bg-cyan-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400'][
                    Math.floor(Math.random() * 5)
                  ]
                } rounded-full`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 animate-slideUp">
        {/* Header */}
        <div className="relative p-8 text-center border-b border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/30"
          >
            <X size={24} />
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <CheckCircle className="relative mx-auto text-green-400 mb-4 animate-bounce" size={80} />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-fadeIn">
            🎉 Skill Swap Accepted!
          </h1>
          
          <p className="text-xl text-gray-300 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Your learning journey with <span className="text-cyan-400 font-semibold">{otherUser?.name}</span> begins now!
          </p>
        </div>

        {/* Swap Details */}
        <div className="p-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-cyan-500/20 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Sparkles className="mr-3 text-yellow-400" size={24} />
              Your Skill Exchange
            </h2>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-white mb-2">{user?.name}</h3>
                <div className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30">
                  Teaching: {swap.fromSkill}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <ArrowRight className="text-gray-400 mb-2 animate-pulse" size={24} />
                <div className="text-xs text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">EXCHANGE</div>
                <ArrowRight className="text-gray-400 mt-2 animate-pulse rotate-180" size={24} />
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
                  {otherUser?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-white mb-2">{otherUser?.name}</h3>
                <div className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                  Teaching: {swap.toSkill}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={onStartChat}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105"
            >
              <MessageCircle size={20} />
              <span className="font-semibold">Start Chatting</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50 transform hover:scale-105"
            >
              <Calendar size={20} />
              <span className="font-semibold">Schedule Later</span>
            </button>
          </div>

          {/* Tips Section */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              💡 Tips for a Successful Skill Swap
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
                      <tip.icon className="text-cyan-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-300">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-8 bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
            <h3 className="text-lg font-semibold text-white mb-4">About {otherUser?.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-white">{otherUser?.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-white font-medium">{otherUser?.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({otherUser?.totalSwaps} swaps)</span>
                </div>
              </div>
            </div>
            {otherUser?.bio && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-1">Bio</p>
                <p className="text-gray-300">{otherUser.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapAcceptedLanding;