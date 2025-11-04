import React, { useState } from 'react';

const CustomerInfo = ({ conversation, onBack, getAvatarBg }) => {
  const [activeTab, setActiveTab] = useState('info');
  const avatarBgClass = getAvatarBg(conversation.avatarColor);

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <i className="fas fa-arrow-left text-gray-700 text-lg"></i>
          </button>
          {/* <h2 className="font-semibold text-lg">Customer Info</h2> */}
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              activeTab === 'info' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              activeTab === 'pages' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('pages')}
          >
            Viewed pages
          </button>
          <button 
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'info' && (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm">Customer Data</h3>
              <div className="space-y-4">
                {/* Customer Name */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-user"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full ${avatarBgClass} flex items-center justify-center text-white text-sm font-bold`}>
                            {conversation.initial}
                          </div>
                          <span className="font-medium">{conversation.name}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600 blur-sm">New York, United States</div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-envelope"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-blue-600">{conversation.name.toLowerCase()}@example.com</div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-phone"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-400">Phone...</div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-tag"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-gray-400">Add a customer tag...</div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Custom properties */}
                <div className="flex items-start">
                  <div className="w-6 text-gray-400 mt-0.5"><i className="fas fa-clipboard-list"></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-400">Add a contact property...</div>
                      <button className="text-blue-600 p-1.5 hover:bg-blue-50 rounded">
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Satisfaction Survey */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm">Satisfaction Survey</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="mb-3">
                  <i className="far fa-smile text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500 text-sm">Visitor has not rated yet</p>
              </div>
            </div>
            
            {/* First seen */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm">First Seen</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm">{conversation.lastMessageTime} ago</p>
                <p className="text-gray-500 text-xs mt-1">Source: Direct</p>
              </div>
            </div>
            
            {/* Device Info */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 uppercase text-sm">Device</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 text-gray-500"><i className="fas fa-laptop"></i></div>
                  <div>
                    <p className="text-gray-700 text-sm">Windows 10</p>
                    <p className="text-gray-500 text-xs">Chrome 98</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 text-gray-500"><i className="fas fa-desktop"></i></div>
                  <div>
                    <p className="text-gray-700 text-sm">1920 x 1080</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'pages' && (
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">Current Page</h3>
                <span className="text-xs text-gray-500">2 min</span>
              </div>
              <a href="#" className="text-blue-600 text-sm hover:underline break-all">https://example.com/product/item-1234</a>
              <p className="text-gray-600 text-xs mt-1">Product Page</p>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-3">Browsing History</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{5 + i * 3} min ago</span>
                    <span className="text-xs text-gray-500">Spent: 2:34</span>
                  </div>
                  <a href="#" className="text-blue-600 text-sm hover:underline break-all">https://example.com/{i === 0 ? 'product/item-1234' : `category-${i}`}</a>
                  <p className="text-gray-600 text-xs mt-1">{i === 0 ? 'Product Page' : `Category ${i}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="p-4">
            <div className="mb-4">
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Add a note about this customer..."
              ></textarea>
              <div className="flex justify-end mt-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Add Note
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      A
                    </div>
                    <span className="text-sm font-medium">Agent</span>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday, 14:22</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700">Customer was inquiring about cryptocurrency payment options. Mentioned they're new to digital currencies.</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                      A
                    </div>
                    <span className="text-sm font-medium">Agent</span>
                  </div>
                  <span className="text-xs text-gray-500">Last week, 09:15</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700">First contact - customer was browsing our premium plans section.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer - Chat Actions */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition">
              <i className="fas fa-user-slash"></i>
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition">
              <i className="fas fa-ban"></i>
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition">
            <i className="fas fa-comment mr-1"></i> Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;