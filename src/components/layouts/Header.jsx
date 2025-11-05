import React from 'react';
import authService from '../../services/authService';
const Header = ({ toggleSidebar, title = "Dashboard" }) => {
  // Add this function
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
            <i className="fas fa-bars text-gray-700 text-xl"></i>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <a href="#" className="text-blue-600 hover:underline text-sm font-medium">
            Usage
          </a>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
            Upgrade
          </button>
          {/* Add logout button here */}
          <button 
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 px-2 py-1 rounded transition"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;