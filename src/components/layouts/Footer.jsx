import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center space-x-2">
            <span>Designed with</span>
            <i className="fas fa-heart text-red-500 animate-pulse"></i>
            <span>by</span>
            <span className="font-semibold text-gray-900">Christopher Okoye</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">© 2025 LiveChat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;