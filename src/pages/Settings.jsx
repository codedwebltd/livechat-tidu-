import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [activeSection, setActiveSection] = useState('account');
  
  // Tabs for Settings Pages
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security & Privacy' },
    { id: 'integrations', label: 'Integrations' }
  ];
  
  // Sections for the sidebar
  const sections = {
    personal: [
      { id: 'account', label: 'Account', icon: 'user' },
      { id: 'profile', label: 'Profile', icon: 'id-card' },
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'billing', label: 'Billing & Plan', icon: 'credit-card' },
      { id: 'team', label: 'Team Members', icon: 'users' }
    ],
    widget: [
      { id: 'chat-widget', label: 'Chat Widget', icon: 'comments' },
      { id: 'appearance', label: 'Appearance', icon: 'paint-brush' },
      { id: 'translations', label: 'Translations', icon: 'language' },
      { id: 'chatbots', label: 'Chatbots', icon: 'robot' }
    ],
    advanced: [
      { id: 'integrations', label: 'Integrations', icon: 'plug' },
      { id: 'api', label: 'API & Webhooks', icon: 'code' },
      { id: 'data', label: 'Data & Privacy', icon: 'shield-alt' }
    ]
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900">Settings</h1> */}
        <div className="flex items-center space-x-3">
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm border border-gray-200 flex items-center space-x-2 shadow-sm">
            <i className="fas fa-question-circle text-gray-500"></i>
            <span>Help</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Section: Personal Settings */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                PERSONAL SETTINGS
              </p>
              {sections.personal.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-sm text-left ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas fa-${item.icon} w-5 text-lg`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Section: Widget Settings */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                WIDGET SETTINGS
              </p>
              {sections.widget.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-sm text-left ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas fa-${item.icon} w-5 text-lg`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Section: Advanced Settings */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
                ADVANCED SETTINGS
              </p>
              {sections.advanced.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-sm text-left ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas fa-${item.icon} w-5 text-lg`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Appearance</h2>
                <p className="text-sm text-gray-600">
                  Customize how your chat widget looks to match your brand and website design.
                </p>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-100">
                <div className="flex overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                {/* General Tab Content */}
                <div className="space-y-6">
                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Primary Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center">
                          <div className="relative">
                            <button className="w-10 h-10 rounded-lg bg-blue-600 mr-3 border border-gray-300"></button>
                          </div>
                          <input
                            type="text"
                            className="block w-28 rounded-md border border-gray-300 py-2 px-3 text-sm"
                            placeholder="#3B82F6"
                            value="#3B82F6"
                          />
                        </div>
                      </div>
                      
                      {/* Secondary Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Color
                        </label>
                        <div className="flex items-center">
                          <div className="relative">
                            <button className="w-10 h-10 rounded-lg bg-gray-200 mr-3 border border-gray-300"></button>
                          </div>
                          <input
                            type="text"
                            className="block w-28 rounded-md border border-gray-300 py-2 px-3 text-sm"
                            placeholder="#E5E7EB"
                            value="#E5E7EB"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Widget Position */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Widget Position</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="aspect-video border-2 border-blue-600 rounded-lg p-4 relative bg-white">
                        <div className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <i className="fas fa-comments text-white"></i>
                        </div>
                        <span className="absolute bottom-1 left-1 text-xs font-medium text-blue-600">Right Corner</span>
                      </button>
                      <button className="aspect-video border-2 border-gray-200 rounded-lg p-4 relative bg-white">
                        <div className="absolute left-4 bottom-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <i className="fas fa-comments text-white"></i>
                        </div>
                        <span className="absolute bottom-1 left-1 text-xs font-medium text-gray-500">Left Corner</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Chat Button Appearance */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Chat Button</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Button Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Style
                        </label>
                        <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm">
                          <option>Round Button with Icon</option>
                          <option>Rectangular Button with Text</option>
                          <option>Custom Button</option>
                        </select>
                      </div>
                      
                      {/* Button Icon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Icon
                        </label>
                        <select className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm">
                          <option>Chat Bubble</option>
                          <option>Support</option>
                          <option>Message</option>
                          <option>Custom Icon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Window Size */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Chat Window Size</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Window Size
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="range"
                            min="300"
                            max="500"
                            value="380"
                            className="w-full"
                          />
                        </div>
                        <div className="w-16">
                          <input
                            type="text"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-center text-sm"
                            value="380px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
                    <div className="bg-gray-100 rounded-xl p-8 flex justify-end">
                      <div className="w-80 h-96 bg-white rounded-xl shadow-lg relative border border-gray-200">
                        <div className="w-full h-16 bg-blue-600 rounded-t-xl flex items-center justify-between px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                              <i className="fas fa-user text-blue-600 text-sm"></i>
                            </div>
                            <span className="text-white font-medium">Support Chat</span>
                          </div>
                          <button className="text-white">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <div className="p-4 flex-1 overflow-auto">
                          <div className="text-center text-sm text-gray-500 py-2">Today</div>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs ml-auto mb-3">
                            <p className="text-sm">Hi there! How can I help you today?</p>
                            <div className="text-right text-xs text-gray-500 mt-1">10:24 AM</div>
                          </div>
                          <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs mr-auto">
                            <p className="text-sm">I have a question about your services.</p>
                            <div className="text-right text-xs text-blue-200 mt-1">10:25 AM</div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <input
                              type="text"
                              className="block w-full rounded-full border border-gray-200 py-2 px-4 text-sm"
                              placeholder="Type a message..."
                            />
                            <button className="ml-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-paper-plane text-white text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center absolute right-8 bottom-8 shadow-lg">
                        <i className="fas fa-comments text-white"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-cog text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')} Settings
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  This is a placeholder for the {activeSection} settings page. Click on Appearance in the sidebar to see a fully implemented example.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;