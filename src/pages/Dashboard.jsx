import React, { useState, useEffect } from 'react';
import BlogPostCarousel from '../components/BlogPostCarousel';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Define a simple ShimmerItem component for reuse
  const ShimmerItem = ({ className }) => (
    <div className={`bg-gray-200 rounded-xl relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 bg-shimmer-gradient bg-[length:1000px_100%] animate-shimmer" 
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      {/* Setup Card */}
      {loading ? (
        <ShimmerItem className="h-24 md:h-20 mb-6" />
      ) : (
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold text-sm">1/6</span>
              </div>
              <div className="flex-1">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Finalize your LiveChat setup</h2>
                <p className="text-gray-600 text-xs md:text-sm">Let's get you setup to delight your customers. It's super easy and only takes a few minutes.</p>
              </div>
            </div>
            <Link to="/onboarding" className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap self-start md:self-auto transition">
              Complete onboarding
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Live conversations card */}
          {loading ? (
            <ShimmerItem className="h-24" />
          ) : (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-comments text-gray-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">Live conversations</h4>
                  <p className="text-blue-600 text-xs md:text-sm font-medium">70 unassigned</p>
                </div>
              </div>
            </div>
          )}

          {/* Tickets card */}
          {loading ? (
            <ShimmerItem className="h-24" />
          ) : (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-ticket-alt text-gray-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">Tickets</h4>
                  <p className="text-blue-600 text-xs md:text-sm font-medium">2 unassigned</p>
                </div>
              </div>
            </div>
          )}

          {/* Lyro AI Agent card */}
          {loading ? (
            <ShimmerItem className="h-24" />
          ) : (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-gray-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">Lyro AI Agent</h4>
                  <p className="text-blue-600 text-xs md:text-sm font-medium">Set up Lyro AI Agent</p>
                </div>
              </div>
            </div>
          )}

          {/* Flows card */}
          {loading ? (
            <ShimmerItem className="h-24" />
          ) : (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-project-diagram text-gray-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">Flows</h4>
                  <p className="text-blue-600 text-xs md:text-sm font-medium">1 active Flow</p>
                </div>
              </div>
            </div>
          )}

          {/* Live visitors card */}
          {loading ? (
            <ShimmerItem className="h-24 sm:col-span-2" />
          ) : (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer sm:col-span-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-users text-gray-400 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">Live visitors</h4>
                  <p className="text-blue-600 text-xs md:text-sm font-medium">0 live visitors on your site</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Status */}
      {loading ? (
        <ShimmerItem className="h-48 mb-6" />
      ) : (
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Project status</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            {/* Content here */}
          </div>
        </div>
      )}
      
      {/* Current Usage */}
      {loading ? (
        <ShimmerItem className="h-72 mb-6" />
      ) : (
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Current usage</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            {/* Content here */}
          </div>
        </div>
      )}
      
      {/* Blog Post Carousel */}
      {loading ? (
        <ShimmerItem className="h-64" />
      ) : (
        <BlogPostCarousel />
      )}
    </div>
  );
};

export default Dashboard;