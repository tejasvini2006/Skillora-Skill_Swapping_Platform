import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, User, Minimize2, MoreVertical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'user';
}

interface UserChatProps {
  swapId: string;
  otherUserId: string;
  onClose: () => void;
}

const UserChat: React.FC<UserChatProps> = ({ swapId, otherUserId, onClose }) => {
  const { user } = useAuth();
  const { users, addChatMessage, getChatMessages } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = users.find(u => u.id === otherUserId);

  useEffect(() => {
    // Load existing messages for this swap - NO AUTOMATED WELCOME MESSAGE
    const chatMessages = getChatMessages(swapId);
    setMessages(chatMessages);
  }, [swapId, getChatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      const chatMessages = getChatMessages(swapId);
      if (chatMessages.length !== messages.length) {
        setMessages(chatMessages);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [swapId, messages.length, getChatMessages]);

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

    addChatMessage(swapId, message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // NO AUTOMATED RESPONSES - REMOVED ALL SIMULATION CODE
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
          className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle size={20} />
          <span className="font-medium">Chat with {otherUser?.name}</span>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col z-50 animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {otherUser?.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white">{otherUser?.name}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-300">online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-gray-700/30">
            <MoreVertical size={16} />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-700/30"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-700/30"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto text-gray-500 mb-3" size={48} />
            <p className="text-gray-400">Start your conversation with {otherUser?.name}</p>
            <p className="text-sm text-gray-500 mt-1">Share resources, coordinate sessions, and learn together!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.senderId === user?.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-100 border border-gray-600/50'
              } animate-messageSlide`}
            >
              {message.senderId !== user?.id && (
                <div className="flex items-center space-x-2 mb-1">
                  <User size={12} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-300">{message.senderName}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/50">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;