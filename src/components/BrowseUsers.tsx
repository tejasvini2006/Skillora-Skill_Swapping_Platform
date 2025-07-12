import React, { useState } from 'react';
import { Search, MapPin, Star, MessageCircle, Filter, Users, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import SwapRequestModal from './SwapRequestModal';

const BrowseUsers: React.FC = () => {
  const { getPublicUsers } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const publicUsers = getPublicUsers().filter(u => u.id !== user?.id);

  const filteredUsers = publicUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !locationFilter || u.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSkill = !skillFilter || u.skillsOffered.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesLocation && matchesSkill;
  });

  const handleSwapRequest = (targetUser: any) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-3 text-blue-500" size={28} />
              Browse Users
            </h1>
            <p className="text-gray-600">Find skilled people in your community</p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredUsers.length} users found
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {locationFilter && (
              <button
                onClick={() => setLocationFilter('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {skillFilter && (
              <button
                onClick={() => setSkillFilter('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || locationFilter || skillFilter) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-2">
                  <X size={12} />
                </button>
              </span>
            )}
            {locationFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter('')} className="ml-2">
                  <X size={12} />
                </button>
              </span>
            )}
            {skillFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Skill: {skillFilter}
                <button onClick={() => setSkillFilter('')} className="ml-2">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Users className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  {user.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {user.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-gray-600 mb-4">{user.bio}</p>
              )}

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Skills Offered:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.length === 0 ? (
                    <span className="text-sm text-gray-500">No skills listed</span>
                  ) : (
                    user.skillsOffered.slice(0, 3).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  )}
                  {user.skillsOffered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Looking For:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.length === 0 ? (
                    <span className="text-sm text-gray-500">No skills requested</span>
                  ) : (
                    user.skillsWanted.slice(0, 3).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  )}
                  {user.skillsWanted.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{user.skillsWanted.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {user.availability && user.availability.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Available:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.availability.map((time: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {user.totalSwaps} swaps completed
                </div>
                <button
                  onClick={() => handleSwapRequest(user)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <MessageCircle size={16} />
                  <span>Request Swap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRequestModal && selectedUser && (
        <SwapRequestModal
          targetUser={selectedUser}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowseUsers;