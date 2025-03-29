import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, X } from 'lucide-react';

const notificationsData = [
  {
    id: 1,
    type: 'success',
    title: 'Event Created Successfully',
    message: 'Your event "Annual Meeting" was created successfully.',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'info',
    title: 'New Voter Registered',
    message: 'A new voter has registered for your event.',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'error',
    title: 'Failed Login Attempt',
    message: 'There was an unsuccessful login attempt on your account.',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'info',
    title: 'Event Reminder',
    message: 'Your event "Weekly Poll" is scheduled for tomorrow.',
    time: '2 days ago',
  },
];

const NotificationCard = ({ notification, onDismiss }: any) => {
  const icons = {
    success: <CheckCircle className="text-green-600 h-6 w-6" />,
    info: <Info className="text-blue-600 h-6 w-6" />,
    error: <Bell className="text-red-600 h-6 w-6" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4"
    >
      <div className="flex-shrink-0">{icons[notification.type]}</div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800">{notification.title}</h4>
        <p className="text-gray-600 text-sm">{notification.message}</p>
        <span className="text-gray-400 text-xs">{notification.time}</span>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');

  const handleDismiss = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-[-25px]">
      {/* Header */}
      <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white py-8 sm:py-12 px-4 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Notifications
        </motion.h1>
        <motion.p
          className="mt-2 text-base sm:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Stay updated with the latest activities and alerts.
        </motion.p>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {['all', 'success', 'info', 'error'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {type === 'all' ? 'All Notifications' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 col-span-full"
          >
            No notifications available.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;