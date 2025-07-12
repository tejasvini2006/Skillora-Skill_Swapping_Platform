import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'user' | 'bot';
}

interface ChatBotProps {
  swapId: string;
  otherUserId: string;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ swapId, otherUserId, onClose }) => {
  const { user } = useAuth();
  const { users } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = users.find(u => u.id === otherUserId);

  useEffect(() => {
    // Load existing messages for this swap
    const savedMessages = localStorage.getItem(`chat_${swapId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: '1',
        senderId: 'bot',
        senderName: 'SkillSwap AI',
        content: `🎉 Welcome to your skill swap chat! You're now connected with ${otherUser?.name}. Here are some conversation starters:\n\n• Share your availability and preferred meeting times\n• Discuss the specific skills you'll be exchanging\n• Plan your first session\n• Ask about their experience level\n\nHappy learning! 🚀`,
        timestamp: new Date().toISOString(),
        type: 'bot'
      };
      setMessages([welcomeMessage]);
    }
  }, [swapId, otherUser?.name]);

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem(`chat_${swapId}`, JSON.stringify(messages));
    }
  }, [messages, swapId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      senderName: user!.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate AI responses for certain keywords
    setTimeout(() => {
      let botResponse = '';
      const lowerMessage = newMessage.toLowerCase();

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        botResponse = `Hello! I see you're chatting with ${otherUser?.name}. Feel free to introduce yourselves and discuss your skill exchange! 👋`;
      } else if (lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
        botResponse = '📅 Great! Scheduling is important. Consider sharing your availability and time zones. You can also use external calendar tools to coordinate better.';
      } else if (lowerMessage.includes('help')) {
        botResponse = '🤖 I\'m here to help! You can:\n• Share contact information\n• Discuss skill levels and expectations\n• Plan your learning sessions\n• Exchange resources and materials\n\nNeed anything specific?';
      } else if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
        botResponse = '🙏 You\'re welcome! Enjoy your skill exchange journey. Remember, the best learning happens through practice and patience!';
      } else if (Math.random() > 0.7) {
        const responses = [
          '💡 Tip: Clear communication is key to successful skill swaps!',
          '🎯 Remember to set clear goals for your learning sessions.',
          '⭐ Don\'t forget to leave feedback after your skill exchange!',
          '🔄 Consider doing regular check-ins to track your progress.',
          '📚 Sharing resources and materials can enhance your learning experience!'
        ];
        botResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      if (botResponse) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'bot',
          senderName: 'SkillSwap AI',
          content: botResponse,
          timestamp: new Date().toISOString(),
          type: 'bot'
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle size={20} />
          <span className="font-medium">Chat with {otherUser?.name}</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {otherUser?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{otherUser?.name}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.type === 'bot'
                  ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                  : message.senderId === user?.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-gray-700/50 text-gray-100 border border-gray-600/50'
              }`}
            >
              {message.type === 'bot' && (
                <div className="flex items-center space-x-2 mb-1">
                  <Bot size={14} className="text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">SkillSwap AI</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/25"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;