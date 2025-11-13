import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useConversations } from '../../hooks/useConversations';

const username = authService.getUserData('name');
const email = authService.getUserData('email');

const Sidebar = ({ isOpen, onClose, activePage = 'Dashboard', onNavigate = () => {} }) => {
  const { conversations } = useConversations();
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count from conversations prop
  // NO Pusher subscriptions - Inbox handles that!
  useEffect(() => {
    const count = conversations.filter(conv => 
      !conv.isRead && conv.hasNewMessages && conv.status === 'open'
    ).length;
    
    console.log('📊 SIDEBAR: Calculated unread count:', count);
    setUnreadCount(count);
  }, [conversations]);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 w-60 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center p-5 border-b border-gray-100">
        <div className="flex items-center justify-center flex-shrink-0 bg-blue-600 rounded-lg w-9 h-9">
          <i className="text-lg text-white fas fa-comments"></i>
        </div>
        <span className="ml-3 text-xl font-bold text-gray-900">LiveChat</span>
      </div>

      <div className="overflow-y-auto h-[calc(100%-130px)]">
        <div className="p-4">
          <div className="mb-5">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">MAIN MENU</p>

            <a 
              href="/"
              onClick={() => onNavigate('Dashboard')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-chart-line"></i>
              <span className="ml-3 font-medium">Dashboard</span>
            </a>

            <a
              href="/inbox"
              onClick={() => onNavigate('Inbox')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Inbox' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <i className="w-5 text-lg fas fa-inbox"></i>
                <span className="ml-3 font-medium">Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </a>

            <a
              href="/tickets"
              onClick={() => onNavigate('Tickets')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Tickets' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <i className="w-5 text-lg fas fa-ticket-alt"></i>
                <span className="ml-3 font-medium">Tickets</span>
              </div>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold">2</span>
            </a>
          </div>

          <div className="mb-5">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">CUSTOMER</p>

            <a
              href="/visitors"
              onClick={() => onNavigate('Visitors')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Visitors' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <i className="w-5 text-lg fas fa-users"></i>
                <span className="ml-3 font-medium">Visitors</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </a>

            <Link
              to="/contacts"
              onClick={() => onNavigate('Contacts')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Contacts' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-address-book"></i>
              <span className="ml-3 font-medium">Contacts</span>
            </Link>
          </div>

          <div className="mb-5">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">AUTOMATION</p>

            <Link
              to="/ai-agent"
              onClick={() => onNavigate('AI Agent')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'AI Agent' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <i className="w-5 text-lg fas fa-robot"></i>
                <span className="ml-3 font-medium">AI Agent</span>
              </div>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-semibold">New</span>
            </Link>

            <Link
              to="/flows"
              onClick={() => onNavigate('Flows')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Flows' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-project-diagram"></i>
              <span className="ml-3 font-medium">Flows</span>
            </Link>

            <Link
              to="/chatbots"
              onClick={() => onNavigate('Chatbots')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Chatbots' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-comment-dots"></i>
              <span className="ml-3 font-medium">Chatbots</span>
            </Link>
          </div>

          <div className="mb-5">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">REPORTS</p>

            <Link
              to="/analytics"
              onClick={() => onNavigate('Analytics')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Analytics' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-chart-bar"></i>
              <span className="ml-3 font-medium">Analytics</span>
            </Link>

            <Link
              to="/feedback"
              onClick={() => onNavigate('Feedback')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Feedback' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-star"></i>
              <span className="ml-3 font-medium">Feedback</span>
            </Link>
          </div>

          <div className="mb-5">
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">SYSTEM</p>

            <a
              href="/settings"
              onClick={() => onNavigate('Settings')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <i className="w-5 text-lg fas fa-cog"></i>
                <span className="ml-3 font-medium">Settings</span>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </a>

            <a
              href="/widget"
              onClick={() => onNavigate('Widget Installation')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Widget Installation' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <i className="w-5 text-lg fas fa-plug"></i>
              <span className="ml-3 font-medium">Widget</span>
            </a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-gray-200 shadow-sm sm:w-auto" style={{ zIndex: 50 }}>
        <div className="p-2 bg-white sm:p-4">
          <div className="flex items-center p-2 space-x-2 bg-white rounded-lg sm:space-x-3 hover:bg-gray-50">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full shadow-md sm:w-10 sm:h-10">
              <span className="text-xs font-bold text-white sm:text-sm">
                {username ? username.split(' ').map(word => word.charAt(0)).join('').toUpperCase() : ''}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate sm:text-sm">{username}</p>
              <p className="text-gray-500 truncate text-2xs sm:text-xs">{email}</p>
            </div>
            
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;