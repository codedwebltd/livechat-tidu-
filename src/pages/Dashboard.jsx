import React, { useState, useEffect } from 'react';
import BlogPostCarousel from '../components/BlogPostCarousel';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    });//add ,1000 to simulate data loading etc.....
    
    return () => clearTimeout(timer);
  }, []);

  // Shimmer component inline - no need for separate file
  const Shimmer = ({ className }) => (
    <div className={`bg-gray-200 rounded-xl overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:1000px_100%] animate-shimmer" />
    </div>
  );

  const getNextStepText = (currentStep) => {
  const steps = {
    'company': 'Complete company information',
    'website': 'Set up your website details',
    'appearance': 'Customize widget appearance',
    'welcome': 'Configure welcome message',
    'install': 'Install chat widget'
  };
  
  return steps[currentStep] || 'Complete your setup';
};
  return (
    <div className="p-4 md:p-6">
{/* Setup Card */}
{loading ? (
  <Shimmer className="h-24 md:h-20 mb-6" />
) : (
  <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          {authService.isOnboardingCompleted() ? (
            <span className="text-green-600 font-semibold text-sm">6/6</span>
          ) : (
            <span className="text-green-600 font-semibold text-sm">
              {`${authService.getUserData('onboarding_step') || 0}/6`}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
            {authService.isOnboardingCompleted() ? 'LiveChat setup completed!' : 'Finalize your LiveChat setup'}
          </h2>
          <p className="text-gray-600 text-xs md:text-sm">
            {authService.isOnboardingCompleted() 
              ? 'Your account is fully set up. You can now start using LiveChat.'
              : 'Let\'s get you setup to delight your customers. It\'s super easy and only takes a few minutes.'}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: authService.isOnboardingCompleted() ? '100%' : `${((authService.getUserData('onboarding_step') || 0) / 6) * 100}%` 
              }}
            ></div>
          </div>
          
          {/* Next step based on current_step in onboarding */}
          {!authService.isOnboardingCompleted() && (
            <p className="text-blue-600 text-xs mt-2">
              Next step: {getNextStepText(authService.getUserData('onboarding.current_step'))}
            </p>
          )}
        </div>
      </div>
      <Link to="/onboarding" className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap self-start md:self-auto transition">
        {authService.isOnboardingCompleted() ? 'View setup' : 'Complete onboarding'}
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
            <Shimmer className="h-24" />
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
            <Shimmer className="h-24" />
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
            <Shimmer className="h-24" />
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
            <Shimmer className="h-24" />
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
            <Shimmer className="h-24 sm:col-span-2" />
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
        <Shimmer className="h-48 mb-6" />
      ) : (
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Project status</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            
{/* Chat Widget */}
<div className="flex items-start justify-between pb-4 mb-4 border-b border-gray-100">
  <div className="flex items-start space-x-3">
    <i className="fas fa-comment-dots text-gray-400 text-xl mt-1"></i>
    <div>
      <h4 className="font-semibold text-gray-900 text-sm">Chat Widget</h4>
      {authService.getUserData('widget_installed') ? (
        <p className="text-green-600 text-xs flex items-center mt-1">
          <i className="fas fa-check-circle mr-1"></i>
          Chat Widget is installed
        </p>
      ) : (
        <p className="text-red-600 text-xs flex items-center mt-1">
          <i className="fas fa-exclamation-circle mr-1"></i>
          Chat Widget is not installed
        </p>
      )}
    </div>
  </div>
  <Link to="/widget" className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">
    {authService.getUserData('widget_installed') ? 'View Widget' : 'Install Chat Widget'}
  </Link>
</div>

            {/* Mailbox */}
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                <i className="fas fa-envelope text-gray-400 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Mailbox</h4>
                  <p className="text-gray-500 text-xs mt-1">Connect your email inbox</p>
                </div>
              </div>
              <a href="#" className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">Connect your mailbox</a>
            </div>

            {/* Domains */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <i className="fas fa-globe text-gray-400 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Domains</h4>
                  <p className="text-gray-500 text-xs mt-1">Add your website domain</p>
                </div>
              </div>
              <a href="#" className="text-blue-600 hover:underline text-xs font-medium whitespace-nowrap">Connect domain</a>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Usage */}
      {loading ? (
        <Shimmer className="h-72 mb-6" />
      ) : (
        <div className="mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Current usage</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            
            {/* Customer Service */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Customer service</h4>
                  <p className="text-xs text-gray-500 mt-1">Free</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">0 <span className="text-sm text-gray-500 font-normal">/ 50</span></p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <a href="#" className="text-blue-600 hover:underline text-xs font-medium inline-block mt-2">Install Chat Widget to see this</a>
            </div>

            {/* Lyro AI Agent */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Lyro AI Agent</h4>
                  <p className="text-xs text-gray-500 mt-1">Free</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">0 <span className="text-sm text-gray-500 font-normal">/ 50</span></p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <a href="#" className="text-blue-600 hover:underline text-xs font-medium inline-block mt-2">Set up Lyro AI Agent</a>
            </div>

            {/* Flows */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Flows</h4>
                  <p className="text-xs text-gray-500 mt-1">Free</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">0 <span className="text-sm text-gray-500 font-normal">/ 100</span></p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">100 visitors reached</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Blog Post Carousel */}
      {loading ? (
        <Shimmer className="h-64" />
      ) : (
        <BlogPostCarousel />
      )}
    </div>
  );
};

export default Dashboard;