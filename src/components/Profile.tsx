import React, { useState } from 'react';
import { User, MapPin, Clock, Eye, EyeOff, Plus, X, Edit3, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    isPublic: user?.isPublic || true,
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      updateUser({
        skillsOffered: [...(user?.skillsOffered || []), newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (index: number) => {
    const updated = [...(user?.skillsOffered || [])];
    updated.splice(index, 1);
    updateUser({ skillsOffered: updated });
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      updateUser({
        skillsWanted: [...(user?.skillsWanted || []), newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (index: number) => {
    const updated = [...(user?.skillsWanted || [])];
    updated.splice(index, 1);
    updateUser({ skillsWanted: updated });
  };

  const addAvailability = () => {
    if (newAvailability.trim()) {
      updateUser({
        availability: [...(user?.availability || []), newAvailability.trim()]
      });
      setNewAvailability('');
    }
  };

  const removeAvailability = (index: number) => {
    const updated = [...(user?.availability || [])];
    updated.splice(index, 1);
    updateUser({ availability: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="mr-3 text-blue-500" size={28} />
            My Profile
          </h1>
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              {editData.isPublic ? (
                <Eye className="text-green-500" size={16} />
              ) : (
                <EyeOff className="text-gray-500" size={16} />
              )}
              <span className="text-sm text-gray-600">
                {editData.isPublic ? 'Public Profile' : 'Private Profile'}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{user?.rating?.toFixed(1)}</div>
                <div>Rating</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{user?.totalSwaps}</div>
                <div>Swaps</div>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {user?.location || 'Not specified'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell others about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{user?.bio || 'No bio added yet'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isEditing ? editData.isPublic : user?.isPublic}
                  onChange={(e) => {
                    if (isEditing) {
                      setEditData({ ...editData, isPublic: e.target.checked });
                    } else {
                      updateUser({ isPublic: e.target.checked });
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Make my profile public</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Public profiles can be found by other users for skill swaps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Skills I Offer</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user?.skillsOffered?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkillOffered(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newSkillOffered}
            onChange={(e) => setNewSkillOffered(e.target.value)}
            placeholder="Add a skill you can teach..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
          />
          <button
            onClick={addSkillOffered}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Skills I Want to Learn</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user?.skillsWanted?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkillWanted(index)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newSkillWanted}
            onChange={(e) => setNewSkillWanted(e.target.value)}
            placeholder="Add a skill you want to learn..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
          />
          <button
            onClick={addSkillWanted}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Availability</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user?.availability?.map((time, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              <Clock size={14} className="mr-1" />
              {time}
              <button
                onClick={() => removeAvailability(index)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newAvailability}
            onChange={(e) => setNewAvailability(e.target.value)}
            placeholder="e.g., Weekends, Evenings, Monday 6-8 PM..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
          />
          <button
            onClick={addAvailability}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;