import React, { useState } from 'react';
import { MessageCircle, Check, X, Clock, Star, Trash2, User } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import FeedbackModal from './FeedbackModal';
import UserChat from './ChatBot';

const SwapRequests: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest, users } = useData();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatSwap, setChatSwap] = useState<any>(null);

  const receivedRequests = swapRequests.filter(req => req.toUserId === user?.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === user?.id);

  const getUserById = (id: string) => users.find(u => u.id === id);

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'accepted' });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'rejected' });
  };

  const handleComplete = (request: any) => {
    updateSwapRequest(request.id, { status: 'completed' });
    setSelectedSwap(request);
    setShowFeedbackModal(true);
  };

  const handleCancel = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'cancelled' });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
  };

  const handleStartChat = (request: any) => {
    setChatSwap(request);
    setShowChat(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRequest = (request: any, isReceived: boolean) => {
    const otherUser = getUserById(isReceived ? request.fromUserId : request.toUserId);
    if (!otherUser) return null;

    return (
      <div key={request.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white">{otherUser.name}</h3>
              <p className="text-sm text-gray-400">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>

        <div className="mb-4">
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <div className="flex items-center justify-center mb-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30">
                {request.fromSkill}
              </span>
              <span className="mx-3 text-gray-500">↔</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                {request.toSkill}
              </span>
            </div>
            <p className="text-sm text-gray-300 text-center">
              {isReceived ? 'wants to learn' : 'you want to learn'} <strong>{request.toSkill}</strong> in exchange for <strong>{request.fromSkill}</strong>
            </p>
          </div>
        </div>

        {request.message && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 italic bg-gray-700/20 p-3 rounded-lg border-l-4 border-cyan-500/50">"{request.message}"</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {request.status === 'pending' && isReceived && (
            <>
              <button
                onClick={() => handleAccept(request.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                <Check size={16} />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/25"
              >
                <X size={16} />
                <span>Reject</span>
              </button>
            </>
          )}

          {request.status === 'pending' && !isReceived && (
            <button
              onClick={() => handleCancel(request.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          )}

          {request.status === 'accepted' && (
            <>
              <button
                onClick={() => handleStartChat(request)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                <MessageCircle size={16} />
                <span>Start Chat</span>
              </button>
              <button
                onClick={() => handleComplete(request)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <Star size={16} />
                <span>Mark Complete</span>
              </button>
            </>
          )}

          {(request.status === 'rejected' || request.status === 'cancelled') && (
            <button
              onClick={() => handleDelete(request.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/25"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
          <MessageCircle className="mr-3 text-cyan-400" size={28} />
          Swap Requests
        </h1>

        <div className="flex space-x-1 mb-6 bg-gray-700/30 rounded-lg p-1 border border-gray-600/30">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
              activeTab === 'received'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
              activeTab === 'sent'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedRequests.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-12 text-center">
              <MessageCircle className="mx-auto text-gray-500 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No requests received</h3>
              <p className="text-gray-400">When others request skill swaps with you, they'll appear here</p>
            </div>
          ) : (
            receivedRequests.map(request => renderRequest(request, true))
          )
        ) : (
          sentRequests.length === 0 ? (
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-12 text-center">
              <User className="mx-auto text-gray-500 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No requests sent</h3>
              <p className="text-gray-400">Browse users and send your first swap request!</p>
            </div>
          ) : (
            sentRequests.map(request => renderRequest(request, false))
          )
        )}
      </div>

      {showFeedbackModal && selectedSwap && (
        <FeedbackModal
          swap={selectedSwap}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedSwap(null);
          }}
        />
      )}

      {showChat && chatSwap && (
        <UserChat
          swapId={chatSwap.id}
          otherUserId={chatSwap.fromUserId === user?.id ? chatSwap.toUserId : chatSwap.fromUserId}
          onClose={() => {
            setShowChat(false);
            setChatSwap(null);
          }}
        />
      )}
    </div>
  );
};

export default SwapRequests;