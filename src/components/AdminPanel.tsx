import React, { useState } from 'react';
import { Shield, Users, MessageCircle, Ban, Download, Send, Trash2, Eye, AlertTriangle, X, XCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const AdminPanel: React.FC = () => {
  const { users, swapRequests, feedbacks, updateUserInList } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'swaps' | 'skills' | 'messages' | 'reports'>('users');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const toggleUserBan = (userId: string, currentBanStatus: boolean) => {
    updateUserInList(userId, { isBanned: !currentBanStatus });
  };

  const rejectSkill = (userId: string, skillType: 'offered' | 'wanted', skillIndex: number) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedSkills = [...(skillType === 'offered' ? targetUser.skillsOffered : targetUser.skillsWanted)];
    updatedSkills.splice(skillIndex, 1);
    
    updateUserInList(userId, {
      [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: updatedSkills
    });
  };

  const sendBroadcast = () => {
    alert(`✅ Platform-wide message sent successfully to ${users.filter(u => !u.isBanned && u.role !== 'admin').length} active users!\n\nMessage: "${broadcastMessage}"`);
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue color
    doc.text('SkillSwap Platform Report', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, 20, 35);
    doc.text(`Report by: ${user?.name} (Admin)`, 20, 42);
    
    // Platform Statistics
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Platform Statistics', 20, 60);
    
    const platformStats = [
      ['Total Users', users.length.toString()],
      ['Active Users', users.filter(u => !u.isBanned).length.toString()],
      ['Banned Users', users.filter(u => u.isBanned).length.toString()],
      ['Public Profiles', users.filter(u => u.isPublic).length.toString()],
    ];
    
    doc.autoTable({
      startY: 70,
      head: [['Metric', 'Count']],
      body: platformStats,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
    });
    
    // Swap Statistics
    let currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Swap Statistics', 20, currentY);
    
    const swapStats = [
      ['Total Swaps', swapRequests.length.toString()],
      ['Pending', swapRequests.filter(s => s.status === 'pending').length.toString()],
      ['Active', swapRequests.filter(s => s.status === 'accepted').length.toString()],
      ['Completed', swapRequests.filter(s => s.status === 'completed').length.toString()],
      ['Rejected', swapRequests.filter(s => s.status === 'rejected').length.toString()],
      ['Cancelled', swapRequests.filter(s => s.status === 'cancelled').length.toString()],
      ['Success Rate', ((swapRequests.filter(s => s.status === 'completed').length / (swapRequests.length || 1)) * 100).toFixed(1) + '%'],
    ];
    
    doc.autoTable({
      startY: currentY + 10,
      head: [['Status', 'Count']],
      body: swapStats,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
    });
    
    // Feedback Statistics
    currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Feedback Overview', 20, currentY);
    
    const feedbackStats = [
      ['Total Feedbacks', feedbacks.length.toString()],
      ['Average Rating', (feedbacks.reduce((sum, f) => sum + f.rating, 0) / (feedbacks.length || 1)).toFixed(1) + '/5'],
      ['5-Star Reviews', feedbacks.filter(f => f.rating === 5).length.toString()],
      ['4-Star Reviews', feedbacks.filter(f => f.rating === 4).length.toString()],
      ['3-Star Reviews', feedbacks.filter(f => f.rating === 3).length.toString()],
      ['2-Star Reviews', feedbacks.filter(f => f.rating === 2).length.toString()],
      ['1-Star Reviews', feedbacks.filter(f => f.rating === 1).length.toString()],
    ];
    
    doc.autoTable({
      startY: currentY + 10,
      head: [['Metric', 'Value']],
      body: feedbackStats,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
    });
    
    // Add new page for user details
    doc.addPage();
    
    // User Activity Table
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('User Activity Details', 20, 25);
    
    const userActivityData = users
      .filter(u => u.role !== 'admin')
      .map(u => [
        u.name,
        u.email,
        u.totalSwaps.toString(),
        u.rating.toFixed(1),
        u.skillsOffered.length.toString(),
        u.skillsWanted.length.toString(),
        u.isBanned ? 'Banned' : 'Active',
        new Date(u.createdAt).toLocaleDateString(),
      ]);
    
    doc.autoTable({
      startY: 35,
      head: [['Name', 'Email', 'Swaps', 'Rating', 'Skills Offered', 'Skills Wanted', 'Status', 'Joined']],
      body: userActivityData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 10, right: 10 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 },
      },
    });
    
    // Recent Feedback Details (if space allows)
    if (feedbacks.length > 0) {
      currentY = (doc as any).lastAutoTable.finalY + 20;
      
      if (currentY < 250) { // Check if there's space on current page
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Recent Feedback (Last 10)', 20, currentY);
        
        const recentFeedbacks = feedbacks
          .slice(-10)
          .map(f => [
            users.find(u => u.id === f.fromUserId)?.name || 'Unknown',
            users.find(u => u.id === f.toUserId)?.name || 'Unknown',
            f.rating.toString() + '/5',
            f.comment.length > 50 ? f.comment.substring(0, 50) + '...' : f.comment,
            new Date(f.createdAt).toLocaleDateString(),
          ]);
        
        doc.autoTable({
          startY: currentY + 10,
          head: [['From', 'To', 'Rating', 'Comment', 'Date']],
          body: recentFeedbacks,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 10, right: 10 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 20 },
            3: { cellWidth: 70 },
            4: { cellWidth: 25 },
          },
        });
      }
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      doc.text('SkillSwap Platform - Confidential', 20, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`skillswap-admin-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Pending Swaps',
      value: swapRequests.filter(s => s.status === 'pending').length,
      icon: MessageCircle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Active Swaps',
      value: swapRequests.filter(s => s.status === 'accepted').length,
      icon: MessageCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Banned Users',
      value: users.filter(u => u.isBanned).length,
      icon: Ban,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Shield className="mr-3 text-red-500" size={28} />
              Admin Control Panel
            </h1>
            <p className="text-gray-300 mt-2">Manage platform policies and monitor activity</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              <Send size={18} />
              <span>Send Platform Message</span>
            </button>
            <button
              onClick={generateReport}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/25"
            >
              <Download size={18} />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-700/30 rounded-lg p-1 overflow-x-auto border border-gray-600/30">
          {[
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'swaps', label: 'Swap Monitoring', icon: MessageCircle },
            { id: 'skills', label: 'Skill Moderation', icon: AlertTriangle },
            { id: 'messages', label: 'Platform Messages', icon: Send },
            { id: 'reports', label: 'Reports', icon: Download },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 flex-1 py-3 px-4 rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === id
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/30'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-600/50">
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Skills</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Rating</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.id !== user?.id && u.role !== 'admin').map((u) => (
                    <tr key={u.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{u.name}</p>
                            <p className="text-sm text-gray-400">{u.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-300">
                          {u.skillsOffered.length} offered, {u.skillsWanted.length} wanted
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{u.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-400"> ({u.totalSwaps} swaps)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.isBanned 
                            ? 'bg-red-100 text-red-800' 
                            : u.isPublic 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.isBanned ? 'Banned' : u.isPublic ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => toggleUserBan(u.id, u.isBanned)}
                            className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              u.isBanned
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                            }`}
                          >
                            <Ban size={14} />
                            <span>{u.isBanned ? 'Unban' : 'Ban'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Swap Monitoring</h2>
            <div className="space-y-3">
              {swapRequests.map((swap) => {
                const fromUser = users.find(u => u.id === swap.fromUserId);
                const toUser = users.find(u => u.id === swap.toUserId);
                
                return (
                  <div key={swap.id} className="border border-gray-600/50 rounded-lg p-4 bg-gray-700/20 hover:bg-gray-700/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {fromUser?.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{fromUser?.name}</span>
                        </div>
                        <span className="text-gray-500">→</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {toUser?.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{toUser?.name}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        swap.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                        swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {swap.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-300 mb-3">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                        {swap.fromSkill}
                      </span>
                      <span className="mx-2">↔</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                        {swap.toSkill}
                      </span>
                    </div>
                    {swap.message && (
                      <p className="text-sm text-gray-300 mb-2 italic bg-gray-600/20 p-3 rounded-lg border-l-4 border-cyan-500/50">"{swap.message}"</p>
                    )}
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Created: {new Date(swap.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(swap.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Skill Moderation</h2>
            <p className="text-gray-300 mb-6">Review and reject inappropriate or spammy skill descriptions</p>
            
            <div className="space-y-4">
              {users.filter(u => u.role !== 'admin' && (u.skillsOffered.length > 0 || u.skillsWanted.length > 0)).map((user) => (
                <div key={user.id} className="border border-gray-600/50 rounded-lg p-4 bg-gray-700/20 hover:bg-gray-700/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </div>

                  {user.skillsOffered.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-white mb-2">Skills Offered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsOffered.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                            <span>{skill}</span>
                            <button
                              onClick={() => rejectSkill(user.id, 'offered', index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Reject this skill"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.skillsWanted.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Skills Wanted:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWanted.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                            <span>{skill}</span>
                            <button
                              onClick={() => rejectSkill(user.id, 'wanted', index)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Reject this skill"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Platform Messages</h2>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                <Send size={18} />
                <span>Send New Message</span>
              </button>
            </div>
            
            <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
              <h3 className="font-semibold text-white mb-4">Message Center</h3>
              <div className="space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-cyan-300 font-medium">Feature Updates</span>
                  </div>
                  <p className="text-gray-300 text-sm">Send announcements about new features and improvements</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-300 font-medium">Maintenance Alerts</span>
                  </div>
                  <p className="text-gray-300 text-sm">Notify users about scheduled maintenance and downtime</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Platform Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4">User Activity Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total Registered</span>
                    <span className="text-sm font-medium text-cyan-400">{users.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Active Users</span>
                    <span className="text-sm font-medium text-green-400">{users.filter(u => !u.isBanned).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Public Profiles</span>
                    <span className="text-sm font-medium text-purple-400">{users.filter(u => u.isPublic).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Banned Users</span>
                    <span className="text-sm font-medium text-red-400">{users.filter(u => u.isBanned).length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4">Swap Statistics</h3>
                <div className="space-y-2">
                  {[
                    { status: 'completed', label: 'Completed', color: 'text-green-400' },
                    { status: 'accepted', label: 'Active', color: 'text-cyan-400' },
                    { status: 'pending', label: 'Pending', color: 'text-yellow-400' },
                    { status: 'rejected', label: 'Rejected', color: 'text-red-400' },
                    { status: 'cancelled', label: 'Cancelled', color: 'text-gray-400' },
                  ].map(({ status, label, color }) => {
                    const count = swapRequests.filter(s => s.status === status).length;
                    const percentage = ((count / (swapRequests.length || 1)) * 100).toFixed(1);
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className={`text-sm font-medium ${color}`}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4">Feedback Overview</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Total Feedbacks</span>
                    <span className="text-sm font-medium text-orange-400">{feedbacks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Average Rating</span>
                    <span className="text-sm font-medium text-cyan-400">
                      {(feedbacks.reduce((sum, f) => sum + f.rating, 0) / (feedbacks.length || 1)).toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Success Rate</span>
                    <span className="text-sm font-medium text-green-400">
                      {((swapRequests.filter(s => s.status === 'completed').length / (swapRequests.length || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                <h3 className="font-semibold text-white mb-4">Download Options</h3>
                <div className="space-y-3">
                  <button
                    onClick={generateReport}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/25"
                  >
                    <Download size={16} />
                    <span>Complete Platform Report</span>
                  </button>
                  <p className="text-xs text-gray-400">
                    Includes user activity, swap statistics, and feedback logs
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white">Send Platform-Wide Message</h2>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message Type
                </label>
                <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white">
                  <option>Feature Update</option>
                  <option>Maintenance Alert</option>
                  <option>Policy Update</option>
                  <option>General Announcement</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message Content
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter your message to all users..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400"
                />
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-cyan-300">
                  📢 This message will be sent to {users.filter(u => !u.isBanned && u.role !== 'admin').length} active users
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/30 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={sendBroadcast}
                  disabled={!broadcastMessage.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-500/25"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;