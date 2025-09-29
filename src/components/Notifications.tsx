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
    <div className="p-6 space-y-6">
      {/* Header with Stats and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="text-blue-400" size={24} />
            <h2 className="text-2xl font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('check-in')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'check-in' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Check-ins
        </button>
        <button
          onClick={() => setFilter('maintenance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'maintenance' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Maintenance
        </button>
        <button
          onClick={() => setFilter('billing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'billing' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setFilter('staff')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'staff' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Staff
        </button>
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
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getCategoryIcon(notification.category)}
                      <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="text-gray-500" size={12} />
                      <span className="text-gray-500 text-xs">{notification.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      variant="secondary"
                      size="sm"
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
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Bed className="mr-2 text-yellow-400" size={20} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" size="sm">
              Schedule Maintenance
            </Button>
            <Button variant="secondary" size="sm">
              Contact Repair Service
            </Button>
            <Button variant="secondary" size="sm">
              Update Room Status
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;