import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import layout components
import Header from './components/layouts/Header';
import Sidebar from './components/layouts/Sidebar';
import Footer from './components/layouts/Footer';

// Import main pages
import Dashboard from './pages/Dashboard';
import Widget from './pages/Widget';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import AIAgent from './pages/AIAgent';

// Import authentication pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';

// Import authentication service
import authService from './services/authService';

// Initialize auth interceptor
authService.setupAxiosInterceptors();

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is already authenticated on page load
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigate = (pageName) => {
    setCurrentPage(pageName);
    closeSidebar();
  };

  // Simple authentication check - using our auth service
  const checkAuth = () => {
    return isAuthenticated || authService.isAuthenticated();
  };

  // Protected route component - redirects to login if not authenticated
  const ProtectedRoute = ({ children }) => {
    if (!checkAuth()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Auth route component - redirects to dashboard if already authenticated
  const AuthRoute = ({ children }) => {
    if (checkAuth()) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Layout with sidebar and header for authenticated pages
  const DashboardLayout = ({ children }) => {
    return (
      <>
        {/* Mobile Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={closeSidebar}
        />
        
        {/* Sidebar Component */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          activePage={currentPage}
          onNavigate={handleNavigate} 
        />
        
        {/* Main Content */}
        <main className="md:ml-60">
          <Header toggleSidebar={toggleSidebar} title={currentPage} />
          {children}
          <Footer />
        </main>
      </>
    );
  };

  return (
    <Router>
      <div className="font-sans overflow-x-hidden bg-[#f7f8fa] min-h-screen">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthRoute>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </AuthRoute>
          } />
          <Route path="/register" element={
            <AuthRoute>
              <Register setIsAuthenticated={setIsAuthenticated} />
            </AuthRoute>
          } />
          <Route path="/forgot-password" element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/widget" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Widget />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Inbox />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/ai-agent/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AIAgent />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all - redirect to login if not authenticated, or dashboard if authenticated */}
          <Route path="*" element={
            checkAuth() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;