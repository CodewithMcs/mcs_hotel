import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock, Calendar, User, Bed } from 'lucide-react';
import Button from './shared/Button';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'check-in' | 'check-out' | 'maintenance' | 'billing' | 'staff' | 'system';
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Maintenance Required',
      message: 'Room 302 air conditioning needs repair. Guest reported issue this morning.',
      time: '2 hours ago',
      read: false,
      category: 'maintenance'
    },
    {
      id: '2',
      type: 'info',
      title: 'Upcoming Check-ins',
      message: '15 guests are scheduled to check in today. Front desk prepared.',
      time: '3 hours ago',
      read: false,
      category: 'check-in'
    },
    {
      id: '3',
      type: 'success',
      title: 'Revenue Milestone',
      message: 'Monthly revenue target exceeded by 12%. Great job team!',
      time: '1 day ago',
      read: true,
      category: 'system'
    },
    {
      id: '4',
      type: 'warning',
      title: 'High Occupancy Alert',
      message: 'Occupancy rate at 96%. Consider overbooking policies for tomorrow.',
      time: '1 day ago',
      read: false,
      category: 'check-in'
    },
    {
      id: '5',
      type: 'error',
      title: 'Payment Overdue',
      message: 'Room 205 payment is 2 days overdue. Total amount: $640.',
      time: '2 days ago',
      read: false,
      category: 'billing'
    },
    {
      id: '6',
      type: 'info',
      title: 'Staff Schedule Update',
      message: 'Night shift schedule has been updated for next week.',
      time: '2 days ago',
      read: true,
      category: 'staff'
    }
  ]);

  const [filter, setFilter] = useState<string>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error': return <AlertTriangle className="text-red-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'check-in':
      case 'check-out': return <Calendar className="text-blue-400" size={16} />;
      case 'maintenance': return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'billing': return <CheckCircle className="text-green-400" size={16} />;
      case 'staff': return <User className="text-purple-400" size={16} />;
      case 'system': return <Bell className="text-gray-400" size={16} />;
      default: return <Info className="text-blue-400" size={16} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'error': return 'border-l-red-500 bg-red-500/5';
      case 'success': return 'border-l-green-500 bg-green-500/5';
      case 'info': return 'border-l-blue-500 bg-blue-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
<div className="p-4 sm:p-6 space-y-6">
  {/* Header with Stats and Actions */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
    <div className="flex items-center space-x-2 flex-wrap">
      <Bell className="text-blue-400" size={24} />
      <h2 className="text-xl sm:text-2xl font-semibold text-white">Notifications</h2>
      {unreadCount > 0 && (
        <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>

    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
      <Button
        onClick={markAllAsRead}
        variant="secondary"
        size="sm"
        disabled={unreadCount === 0}
      >
        Mark All Read
      </Button>
      <Button
        onClick={clearAll}
        variant="danger"
        size="sm"
        disabled={notifications.length === 0}
      >
        Clear All
      </Button>
    </div>
  </div>

  {/* Filter Tabs */}
  <div className="flex flex-wrap gap-2">
    {['all','unread','check-in','maintenance','billing','staff'].map(f => (
      <button
        key={f}
        onClick={() => setFilter(f)}
        className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
          filter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${notifications.length})` : f === 'unread' ? `(${unreadCount})` : ''}
      </button>
    ))}
  </div>

  {/* Notifications List */}
  <div className="space-y-3">
    {filteredNotifications.length === 0 ? (
      <div className="text-center py-12">
        <Bell className="mx-auto text-gray-600 mb-4" size={48} />
        <p className="text-gray-400 text-lg">No notifications found</p>
        <p className="text-gray-500 text-sm mt-2">
          {filter === 'unread' ? "You're all caught up!" : "No notifications match your current filter."}
        </p>
      </div>
    ) : (
      filteredNotifications.map(notification => (
        <div
          key={notification.id}
          className={`bg-gray-800 border border-gray-700 border-l-4 rounded-lg p-4 transition-all duration-200 hover:bg-gray-700/50 ${
            getNotificationColor(notification.type)
          } ${!notification.read ? 'shadow-lg' : 'opacity-75'}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-start sm:items-center space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center flex-wrap space-x-2 mb-1">
                  {getCategoryIcon(notification.category)}
                  <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Clock className="text-gray-500" size={12} />
                  <span className="text-gray-500 text-xs sm:text-sm">{notification.time}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-1 mt-2 sm:mt-0">
              {!notification.read && (
                <Button
                  onClick={() => markAsRead(notification.id)}
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Mark Read
                </Button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
              >
                <X className="text-gray-400 hover:text-white" size={16} />
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Quick Actions */}
  {filteredNotifications.some(n => n.category === 'maintenance') && (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
        <Bed className="mr-2 text-yellow-400" size={20} />
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        <Button variant="primary" size="sm" className="w-full">Schedule Maintenance</Button>
        <Button variant="secondary" size="sm" className="w-full">Contact Repair Service</Button>
        <Button variant="secondary" size="sm" className="w-full">Update Room Status</Button>
      </div>
    </div>
  )}
</div>

  );
};

export default Notifications;