import { X, Trash2, Check, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { api } from '../utils/api';

const NotificationPanel = ({ isOpen, onClose, onUnreadCountChange, isAuthenticated }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if user is authenticated AND panel is open
    if (!isAuthenticated) {
      setNotifications([]);
      setError(null);
      return;
    }

    if (isOpen) {
      const token = localStorage.getItem('food-e-token');
      if (!token) {
        setError('Please login to view notifications');
        setLoading(false);
        return;
      }
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('food-e-token');
      if (!token) {
        setError('Please login to view notifications');
        setLoading(false);
        return;
      }
      const result = await api.getNotifications();
      if (result.success) {
        console.log('Notifications fetched:', result.data);
        setNotifications(Array.isArray(result.data) ? result.data : []);
      } else {
        if (result.error && result.error.includes('401')) {
          setError('Session expired. Please login again.');
        } else {
          setError(result.error || 'Failed to load notifications');
        }
        console.error('Failed to fetch notifications:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError(error.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const result = await api.markNotificationAsRead(id);
      if (result.success) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
        const unreadCount = notifications.filter(n => !n.isRead && n.id !== id).length;
        onUnreadCountChange(unreadCount);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const result = await api.markAllNotificationsAsRead();
      if (result.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const result = await api.deleteNotification(id);
      if (result.success) {
        const updatedNotifications = notifications.filter(n => n.id !== id);
        setNotifications(updatedNotifications);
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        onUnreadCountChange(unreadCount);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;

    try {
      const result = await api.deleteAllNotifications();
      if (result.success) {
        setNotifications([]);
        onUnreadCountChange(0);
      }
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] bg-matte rounded-xl border border-white/10 shadow-2xl z-50 max-h-[calc(100vh-120px)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Count */}
            {notifications.length > 0 && (
              <div className="px-4 pt-3 pb-2 text-sm text-white/60">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-white/60">Loading...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 px-4">
                  <div className="text-red-400 text-center text-sm">{error}</div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-white/60">No notifications</div>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 hover:bg-white/5 transition-colors ${
                        !notification.isRead ? 'bg-brand/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${
                            !notification.isRead ? 'font-semibold text-white' : 'text-white/80'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-brand" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div className="border-t border-white/10 p-4 space-y-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="w-full py-2 px-3 rounded-lg bg-brand/20 text-brand hover:bg-brand/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={deleteAllNotifications}
                  className="w-full py-2 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete all
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
