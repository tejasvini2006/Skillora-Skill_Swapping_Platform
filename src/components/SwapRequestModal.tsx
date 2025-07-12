import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface SwapRequestModalProps {
  targetUser: any;
  onClose: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ targetUser, onClose }) => {
  const { user } = useAuth();
  const { createSwapRequest } = useData();
  const [formData, setFormData] = useState({
    fromSkill: '',
    toSkill: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromSkill || !formData.toSkill) {
      alert('Please select both skills');
      return;
    }

    createSwapRequest({
      fromUserId: user!.id,
      toUserId: targetUser.id,
      fromSkill: formData.fromSkill,
      toSkill: formData.toSkill,
      message: formData.message,
      status: 'pending',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Request Skill Swap</h2>
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
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{targetUser.name}</h3>
            <p className="text-sm text-gray-600">{targetUser.location}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your skill to offer:
            </label>
            <select
              value={formData.fromSkill}
              onChange={(e) => setFormData({ ...formData, fromSkill: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a skill you can teach</option>
              {user?.skillsOffered?.map((skill, index) => (
                <option key={index} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill you want to learn:
            </label>
            <select
              value={formData.toSkill}
              onChange={(e) => setFormData({ ...formData, toSkill: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a skill they offer</option>
              {targetUser.skillsOffered?.map((skill: string, index: number) => (
                <option key={index} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional):
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {formData.fromSkill && formData.toSkill && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Swap Summary:</h4>
              <div className="flex items-center justify-center text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {formData.fromSkill}
                </span>
                <span className="mx-2 text-blue-600">↔</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                  {formData.toSkill}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <Send size={18} />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal;