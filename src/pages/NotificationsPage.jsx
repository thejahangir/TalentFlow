import React, { useState, useEffect } from 'react';
import { mockNotifications } from '../data/mockNotifications';
import { Trash2, CheckCircle, User, Calendar, Briefcase, MessageSquare, FileText, Bell } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  // Load mock notifications on mount
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'candidate': return <User size={20} className="text-[#1890FF]" />;
      case 'interview': return <Calendar size={20} className="text-[#FFC107]" />;
      case 'job': return <Briefcase size={20} className="text-[#00A76F]" />;
      case 'message': return <MessageSquare size={20} className="text-[#8E33FF]" />;
      case 'report': return <FileText size={20} className="text-[#FF5630]" />;
      default: return <Bell size={20} className="text-[#637381]" />;
    }
  };

  const getIconBgForType = (type) => {
    switch (type) {
      case 'candidate': return 'bg-[#1890FF]/10';
      case 'interview': return 'bg-[#FFC107]/10';
      case 'job': return 'bg-[#00A76F]/10';
      case 'message': return 'bg-[#8E33FF]/10';
      case 'report': return 'bg-[#FF5630]/10';
      default: return 'bg-gray-100';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#212b36] mb-1">Notifications</h1>
          <p className="text-[#637381] text-sm">
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#00A76F] hover:bg-[#00A76F]/10 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCircle size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 overflow-hidden flex flex-col">
        {notifications.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className={`p-6 flex items-start gap-5 transition-colors cursor-pointer group ${
                  !notification.isRead ? 'bg-[#00A76F]/5' : 'hover:bg-gray-50'
                } ${index !== notifications.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconBgForType(notification.type)}`}>
                  {getIconForType(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-base truncate pr-4 ${notification.isRead ? 'text-[#212b36] font-medium' : 'text-[#212b36] font-bold'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-[#919eab] font-medium whitespace-nowrap shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.isRead ? 'text-[#637381]' : 'text-[#454f5b]'} pr-8`}>
                    {notification.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-[#919eab] hover:text-[#FF5630] hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 size={18} />
                  </button>
                  {!notification.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00A76F]" title="Unread" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Bell size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#212b36] mb-2">All caught up!</h3>
            <p className="text-[#637381] max-w-sm">
              You don't have any notifications right now. When you do, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
