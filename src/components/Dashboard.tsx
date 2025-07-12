import React from 'react';
import { Users, MessageCircle, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, feedbacks } = useData();

  const userSwapRequests = swapRequests.filter(
    req => req.fromUserId === user?.id || req.toUserId === user?.id
  );

  const pendingRequests = userSwapRequests.filter(req => req.status === 'pending');
  const acceptedRequests = userSwapRequests.filter(req => req.status === 'accepted');
  const completedRequests = userSwapRequests.filter(req => req.status === 'completed');

  const recentFeedbacks = feedbacks
    .filter(feedback => feedback.toUserId === user?.id)
    .slice(0, 3);

  const stats = [
    {
      label: 'Pending Requests',
      value: pendingRequests.length,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Active Swaps',
      value: acceptedRequests.length,
      icon: MessageCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Completed Swaps',
      value: completedRequests.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Your Rating',
      value: user?.rating?.toFixed(1) || '5.0',
      icon: Star,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-300">
          Here's what's happening with your skill swaps today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="mr-2 text-cyan-400" size={24} />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {userSwapRequests.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto text-gray-500 mb-3" size={48} />
                <p className="text-gray-400">No swap requests yet</p>
                <p className="text-sm text-gray-500">Start browsing users to make your first swap!</p>
              </div>
            ) : (
              userSwapRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      {request.fromUserId === user?.id ? 'Sent' : 'Received'} swap request
                    </p>
                    <p className="text-sm text-gray-300">
                      {request.fromSkill} ↔ {request.toSkill}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Star className="mr-2 text-purple-400" size={24} />
            Recent Feedback
          </h2>

          <div className="space-y-4">
            {recentFeedbacks.length === 0 ? (
              <div className="text-center py-8">
                <Star className="mx-auto text-gray-500 mb-3" size={48} />
                <p className="text-gray-400">No feedback yet</p>
                <p className="text-sm text-gray-500">Complete swaps to receive feedback!</p>
              </div>
            ) : (
              recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{feedback.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Ready to swap skills?</h2>
        <p className="mb-6 opacity-90">
          Discover talented people in your community and start exchanging knowledge today!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 flex-1 border border-white/20">
            <h3 className="font-semibold mb-1">Browse Users</h3>
            <p className="text-sm opacity-90">Find people with skills you want to learn</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 flex-1 border border-white/20">
            <h3 className="font-semibold mb-1">Update Profile</h3>
            <p className="text-sm opacity-90">Add more skills to attract swap requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;