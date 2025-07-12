import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackModalProps {
  swap: any;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ swap, onClose }) => {
  const { user } = useAuth();
  const { addFeedback, users } = useData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const otherUser = users.find(u => u.id === (swap.fromUserId === user?.id ? swap.toUserId : swap.fromUserId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addFeedback({
      swapId: swap.id,
      fromUserId: user!.id,
      toUserId: otherUser!.id,
      rating,
      comment,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Leave Feedback</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {otherUser?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{otherUser?.name}</h3>
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <div className="flex items-center justify-center text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {swap.fromSkill}
                </span>
                <span className="mx-2 text-gray-600">↔</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  {swap.toSkill}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How was your experience?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="transition-colors"
                >
                  <Star
                    size={32}
                    className={value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (optional):
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this skill swap..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <Send size={18} />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;