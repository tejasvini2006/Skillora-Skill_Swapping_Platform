import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, MessageCircle, User, Clock, Megaphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface Notification {
  id: string;
  type: 'swap_accepted' | 'swap_request' | 'swap_completed' | 'message' | 'platform_message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationSystemProps {
  onSwapAccepted?: (swap: any) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ onSwapAccepted }) => {
  const { user } = useAuth();
  const { swapRequests, users, getChatMessages, getPlatformMessages } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>(localStorage.getItem('lastNotificationCheck') || new Date().toISOString());
  const [lastMessageCount, setLastMessageCount] = useState<{[key: string]: number}>({});

  useEffect(() => {
    // Load existing notifications
    const saved = localStorage.getItem(`notifications_${user?.id}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, [user?.id]);

  useEffect(() => {
    const checkForUpdates = () => {
      if (!user) return;

      // Check for new swap acceptances
      const recentAcceptances = swapRequests.filter(swap => 
        swap.toUserId === user.id && 
        swap.status === 'accepted' && 
        new Date(swap.updatedAt) > new Date(lastChecked)
      );

      recentAcceptances.forEach(swap => {
        const fromUser = users.find(u => u.id === swap.fromUserId);
        if (fromUser) {
          const notification: Notification = {
            id: `swap_accepted_${swap.id}`,
            type: 'swap_accepted',
            title: '🎉 Skill Swap Accepted!',
            message: `${fromUser.name} accepted your skill swap request for ${swap.toSkill}`,
            timestamp: new Date().toISOString(),
            read: false,
            data: swap
          };

          setNotifications(prev => {
            const exists = prev.find(n => n.id === notification.id);
            if (!exists) {
              const updated = [notification, ...prev];
              localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
              
              // Trigger the landing page
              if (onSwapAccepted) {
                setTimeout(() => onSwapAccepted(swap), 1000);
              }
              
              return updated;
            }
            return prev;
          });
        }
      });

      // Check for new swap requests
      const newRequests = swapRequests.filter(swap => 
        swap.toUserId === user.id && 
        swap.status === 'pending' && 
        new Date(swap.createdAt) > new Date(lastChecked)
      );

      newRequests.forEach(swap => {
        const fromUser = users.find(u => u.id === swap.fromUserId);
        if (fromUser) {
          const notification: Notification = {
            id: `swap_request_${swap.id}`,
            type: 'swap_request',
            title: '📩 New Skill Swap Request',
            message: `${fromUser.name} wants to learn ${swap.toSkill} from you`,
            timestamp: new Date().toISOString(),
            read: false,
            data: swap
          };

          setNotifications(prev => {
            const exists = prev.find(n => n.id === notification.id);
            if (!exists) {
              const updated = [notification, ...prev];
              localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      });

      // Check for new chat messages
      const userSwaps = swapRequests.filter(swap => 
        (swap.fromUserId === user.id || swap.toUserId === user.id) && 
        swap.status === 'accepted'
      );

      userSwaps.forEach(swap => {
        const messages = getChatMessages(swap.id);
        const previousCount = lastMessageCount[swap.id] || 0;
        
        if (messages.length > previousCount) {
          const newMessages = messages.slice(previousCount);
          const otherUserMessages = newMessages.filter(msg => msg.senderId !== user.id);
          
          if (otherUserMessages.length > 0) {
            const otherUser = users.find(u => u.id === (swap.fromUserId === user.id ? swap.toUserId : swap.fromUserId));
            const latestMessage = otherUserMessages[otherUserMessages.length - 1];
            
            const notification: Notification = {
              id: `message_${swap.id}_${latestMessage.id}`,
              type: 'message',
              title: `💬 New message from ${otherUser?.name}`,
              message: latestMessage.content.length > 50 ? latestMessage.content.substring(0, 50) + '...' : latestMessage.content,
              timestamp: new Date().toISOString(),
              read: false,
              data: { swap, message: latestMessage }
            };

            setNotifications(prev => {
              const exists = prev.find(n => n.id === notification.id);
              if (!exists) {
                const updated = [notification, ...prev];
                localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
                return updated;
              }
              return prev;
            });
          }
        }
        
        setLastMessageCount(prev => ({
          ...prev,
          [swap.id]: messages.length
        }));
      });

      // Check for platform messages from admin
      const platformMessages = getPlatformMessages();
      const newPlatformMessages = platformMessages.filter(msg => 
        new Date(msg.timestamp) > new Date(lastChecked) &&
        (!msg.targetUsers || msg.targetUsers.includes(user.id))
      );

      newPlatformMessages.forEach(msg => {
        const notification: Notification = {
          id: `platform_${msg.id}`,
          type: 'platform_message',
          title: '📢 Platform Announcement',
          message: msg.content,
          timestamp: new Date().toISOString(),
          read: false,
          data: msg
        };

        setNotifications(prev => {
          const exists = prev.find(n => n.id === notification.id);
          if (!exists) {
            const updated = [notification, ...prev];
            localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
      });

      setLastChecked(new Date().toISOString());
      localStorage.setItem('lastNotificationCheck', new Date().toISOString());
    };

    const interval = setInterval(checkForUpdates, 2000);
    checkForUpdates(); // Check immediately

    return () => clearInterval(interval);
  }, [swapRequests, users, user, lastChecked, onSwapAccepted, getChatMessages, getPlatformMessages, lastMessageCount]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_accepted': return CheckCircle;
      case 'swap_request': return User;
      case 'swap_completed': return CheckCircle;
      case 'message': return MessageCircle;
      case 'platform_message': return Megaphone;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'swap_accepted': return 'text-green-400';
      case 'swap_request': return 'text-blue-400';
      case 'swap_completed': return 'text-purple-400';
      case 'message': return 'text-cyan-400';
      case 'platform_message': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-gray-800/50"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 z-50 max-h-96 overflow-hidden animate-slideDown">
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="mx-auto text-gray-500 mb-2" size={32} />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-300 ${
                      !notification.read ? 'bg-cyan-500/5 border-l-4 border-l-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-700/30 ${iconColor}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                        <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-500 text-xs flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(notification.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;