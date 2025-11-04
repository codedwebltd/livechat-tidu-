import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import Footer from './components/layouts/Footer';
import Dashboard from './pages/Dashboard';
import Widget from './pages/Widget';
import Inbox from './pages/Inbox'; // Import the Inbox component

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="font-sans overflow-x-hidden bg-[#f7f8fa] min-h-screen">
        {/* Mobile Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={closeSidebar}
        />
        
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content */}
        <main className="md:ml-60">
          <Header toggleSidebar={toggleSidebar} title={currentPage} />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/widget" element={<Widget />} />
            <Route path="/inbox" element={<Inbox />} />
            {/* Add more routes here */}
          </Routes>

          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;