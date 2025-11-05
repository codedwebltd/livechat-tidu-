import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';


const wallet = authService.getUserData('wallet');
const username = authService.getUserData('name');
const email = authService.getUserData('email');
const handleLogout = () => {
  authService.logout();
  window.location.href = '/login';
};
const Sidebar = ({ isOpen, onClose, activePage = 'Dashboard', onNavigate = () => { } }) => {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 w-60 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 flex items-center">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <i className="fas fa-comments text-white text-lg"></i>
        </div>
        <span className="text-xl font-bold text-gray-900 ml-3">LiveChat</span>
      </div>


      {/* Navigation */}
      <div className="overflow-y-auto h-[calc(100%-130px)]"> {/* Adjusted height to account for user profile */}
        {/* Main Menu */}
        <div className="p-4">
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">MAIN MENU</p>

            <Link
              to="/"
              onClick={() => onNavigate('Dashboard')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Dashboard'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-chart-line w-5 text-lg"></i>
              <span className="ml-3 font-medium">Dashboard</span>
            </Link>

            <Link
              to="/inbox"
              onClick={() => onNavigate('Inbox')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Inbox'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <i className="fas fa-inbox w-5 text-lg"></i>
                <span className="ml-3 font-medium">Inbox</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">72</span>
            </Link>

            <Link
              to="/tickets"
              onClick={() => onNavigate('Tickets')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Tickets'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <i className="fas fa-ticket-alt w-5 text-lg"></i>
                <span className="ml-3 font-medium">Tickets</span>
              </div>
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold">2</span>
            </Link>
          </div>

          {/* Customer */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">CUSTOMER</p>

            <Link
              to="/visitors"
              onClick={() => onNavigate('Visitors')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Visitors'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <i className="fas fa-users w-5 text-lg"></i>
                <span className="ml-3 font-medium">Visitors</span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </Link>

            <Link
              to="/contacts"
              onClick={() => onNavigate('Contacts')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Contacts'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-address-book w-5 text-lg"></i>
              <span className="ml-3 font-medium">Contacts</span>
            </Link>
          </div>

          {/* Automation */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">AUTOMATION</p>

            <Link
              to="/ai-agent"
              onClick={() => onNavigate('AI Agent')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'AI Agent'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <i className="fas fa-robot w-5 text-lg"></i>
                <span className="ml-3 font-medium">AI Agent</span>
              </div>
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-semibold">New</span>
            </Link>

            <Link
              to="/flows"
              onClick={() => onNavigate('Flows')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Flows'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-project-diagram w-5 text-lg"></i>
              <span className="ml-3 font-medium">Flows</span>
            </Link>

            <Link
              to="/chatbots"
              onClick={() => onNavigate('Chatbots')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Chatbots'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-comment-dots w-5 text-lg"></i>
              <span className="ml-3 font-medium">Chatbots</span>
            </Link>
          </div>

          {/* Reports */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">REPORTS</p>

            <Link
              to="/analytics"
              onClick={() => onNavigate('Analytics')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Analytics'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-chart-bar w-5 text-lg"></i>
              <span className="ml-3 font-medium">Analytics</span>
            </Link>

            <Link
              to="/feedback"
              onClick={() => onNavigate('Feedback')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Feedback'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-star w-5 text-lg"></i>
              <span className="ml-3 font-medium">Feedback</span>
            </Link>
          </div>

          {/* System */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">SYSTEM</p>

            <Link
              to="/settings"
              onClick={() => onNavigate('Settings')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Settings'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <i className="fas fa-cog w-5 text-lg"></i>
                <span className="ml-3 font-medium">Settings</span>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </Link>

            <Link
              to="/widget"
              onClick={() => onNavigate('Widget Installation')}
              className={`flex items-center px-3 py-2.5 rounded-lg mb-1 ${activePage === 'Widget Installation'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <i className="fas fa-plug w-5 text-lg"></i>
              <span className="ml-3 font-medium">Widget</span>
            </Link>
          </div>
        </div>
      </div>


      {/* User Profile - Fixed and properly styled */}
      <div className="fixed bottom-0 left-0 w-60 bg-white border-t-2 border-gray-200" style={{ boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)', zIndex: 50 }}>
        <div className="p-4 bg-white">
          <div className="flex items-center space-x-3 bg-white p-2 rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {username
                  ? username
                    .split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .toUpperCase()
                  : ''}
              </span>

            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;