import React, { useState, useEffect } from 'react';

const AIAgent = () => {
  // State for various UI elements
  const [activeTab, setActiveTab] = useState('hub');
  const [setupProgress, setSetupProgress] = useState(1);
  const [knowledgeScore, setKnowledgeScore] = useState(15); // 0-100 scale
  const [isLyroActive, setIsLyroActive] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for stats
  const [stats, setStats] = useState({
    conversations: {
      all: 0,
      resolved: 0,
      resolutionRate: 0,
    },
    emails: {
      all: 0,
      resolutionRate: 0,
      firstAnswerRate: 0
    }
  });

  // Knowledge base data
  const [knowledgeData, setKnowledgeData] = useState({
    suggestions: { count: 0, label: 'questions to review' },
    websiteUrl: { count: 0, label: 'pages' },
    qna: { count: 7, label: 'questions and answers' },
    products: { count: 0, label: 'products' }
  });

  // Handle URL input
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setSiteUrl(url);
    // Simple URL validation
    setIsUrlValid(url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/));
  };

  // Simulate adding knowledge
  const handleAddKnowledge = () => {
    if (!isUrlValid || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate API call/processing
    setTimeout(() => {
      setKnowledgeData({
        ...knowledgeData,
        websiteUrl: { ...knowledgeData.websiteUrl, count: 5 }
      });
      setKnowledgeScore(35);
      setSetupProgress(2);
      setIsLoading(false);
    }, 1500);
  };

  // Simulate testing Lyro
  const handleTestLyro = () => {
    if (setupProgress < 2 || isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setSetupProgress(3);
      setIsLoading(false);
    }, 1000);
  };

  // Simulate activating Lyro
  const handleActivateLyro = () => {
    if (setupProgress < 3 || isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLyroActive(true);
      setSetupProgress(4);
      setKnowledgeScore(60);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Lyro AI Agent</h1>
          <p className="text-sm text-gray-600 mt-1">
            Automate customer support with AI that learns from your website and previous conversations
          </p> */}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => handleTestLyro()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              setupProgress >= 2 && !isLyroActive 
                ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={setupProgress < 2 || isLyroActive}
          >
            <i className="fas fa-vial mr-2"></i>
            Test Lyro
          </button>
          <button 
            onClick={() => handleActivateLyro()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              setupProgress >= 3 && !isLyroActive
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                : isLyroActive
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                  : 'bg-blue-100 text-blue-300 cursor-not-allowed'
            }`}
            disabled={setupProgress < 3 && !isLyroActive}
          >
            <i className={`fas ${isLyroActive ? 'fa-check' : 'fa-power-off'} mr-2`}></i>
            {isLyroActive ? 'Active' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('hub')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'hub'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Hub
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'knowledge'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Knowledge
        </button>
        <button
          onClick={() => setActiveTab('datasources')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'datasources'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Data Sources
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="space-y-6">
        {/* Setup Guide */}
        {activeTab === 'hub' && showSetupGuide && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Follow these steps to complete Lyro setup</h2>
                  <p className="text-sm text-gray-600 mb-4">Complete all steps below to get the most out of your AI assistant</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {setupProgress > 1 ? <i className="fas fa-check text-green-500"></i> : "1"}
                    </div>
                    <span className={setupProgress > 1 ? "line-through text-gray-400" : ""}>Add knowledge by providing the URL of your site</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {setupProgress > 2 ? <i className="fas fa-check text-green-500"></i> : "2"}
                    </div>
                    <span className={setupProgress > 2 ? "line-through text-gray-400" : ""}>Test Lyro AI Agent</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {setupProgress > 3 ? <i className="fas fa-check text-green-500"></i> : "3"}
                    </div>
                    <span className={setupProgress > 3 ? "line-through text-gray-400" : ""}>Activate Lyro AI Agent</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {setupProgress > 4 ? <i className="fas fa-check text-green-500"></i> : "4"}
                    </div>
                    <span className={setupProgress > 4 ? "line-through text-gray-400" : ""}>Use suggestions to enhance your knowledge base</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">{setupProgress-1}/4</span>
                <button 
                  onClick={() => setShowSetupGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Performance Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Performance</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              <span>View full analytics</span>
              <i className="fas fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Live Conversations Stats */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Live conversations</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-question-circle"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">All conversations</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">Resolved</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">Resolution rate</p>
                </div>
              </div>
            </div>
            
            {/* Emails Stats */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Emails</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-question-circle"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">All emails</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">Resolution rate</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">—</p>
                  <p className="text-xs text-gray-500 mt-1">First-answer rate</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full h-5 w-5 flex items-center justify-center mr-2">
                <i className="fas fa-circle text-xs text-white"></i>
              </div>
              <span className="text-sm text-gray-700 mr-2">Conversations limit:</span>
              <span className="text-sm font-semibold text-gray-900">0/50</span>
              <button className="text-gray-400 hover:text-gray-600 ml-2">
                <i className="fas fa-question-circle text-xs"></i>
              </button>
            </div>
            
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Upgrade</a>
          </div>
          
          <div className="border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">Lyro responds on:</span>
              <div className="flex space-x-2">
                <button className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                  <i className="fas fa-globe text-white text-xs"></i>
                </button>
                <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-envelope text-gray-500 text-xs"></i>
                </button>
                <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fab fa-facebook-messenger text-gray-500 text-xs"></i>
                </button>
                <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fab fa-whatsapp text-gray-500 text-xs"></i>
                </button>
              </div>
            </div>
            
            <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Configure</a>
          </div>
        </div>

        {/* Knowledge Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Knowledge</h2>
            
            {/* Knowledge Score */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-base font-semibold text-gray-900 mr-2">Complete Lyro setup to view the knowledge score</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">This score is calculated after adding knowledge and activating Lyro.</p>
                </div>
                <button 
                  onClick={handleAddKnowledge}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  Add knowledge
                </button>
              </div>
              
              {/* Knowledge Gauge */}
              <div className="mt-4 relative">
                <svg className="w-full h-12" viewBox="0 0 400 40">
                  {/* Background Track */}
                  <path
                    d="M 20,30 A 60,60 0 0 1 380,30"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Colored Progress */}
                  <path
                    d={`M 20,30 A 60,60 0 0 1 ${20 + (knowledgeScore/100) * 360},30`}
                    stroke={
                      knowledgeScore < 30 ? "#EF4444" :
                      knowledgeScore < 70 ? "#F59E0B" :
                      "#10B981"
                    }
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Dot Indicator */}
                  <circle
                    cx={20 + (knowledgeScore/100) * 360}
                    cy="30"
                    r="10"
                    fill="white"
                    stroke={
                      knowledgeScore < 30 ? "#EF4444" :
                      knowledgeScore < 70 ? "#F59E0B" :
                      "#10B981"
                    }
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            
            {/* Knowledge Source Items */}
            <div className="space-y-4">
              {/* Suggestions */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-0.5">Suggestions</h4>
                    <p className="text-xs text-gray-500">Knowledge to add from unanswered questions and past Inbox conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{knowledgeData.suggestions.count} {knowledgeData.suggestions.label}</span>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium shadow-sm">
                    Manage
                  </button>
                </div>
              </div>
              
              {/* Website URL */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-0.5">Website URL</h4>
                    <p className="text-xs text-gray-500">Content imported from URLs, like knowledge bases or websites</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{knowledgeData.websiteUrl.count} {knowledgeData.websiteUrl.label}</span>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium shadow-sm">
                    Manage
                  </button>
                </div>
              </div>
              
              {/* Q&A */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-question text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-0.5">Q&A</h4>
                    <p className="text-xs text-gray-500">Questions and answers content</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{knowledgeData.qna.count} {knowledgeData.qna.label}</span>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium shadow-sm">
                    Manage
                  </button>
                </div>
              </div>
              
              {/* Product database */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-box text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-0.5">Product database</h4>
                    <p className="text-xs text-gray-500">Content from your products used for product recommendation</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{knowledgeData.products.count} {knowledgeData.products.label}</span>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium shadow-sm">
                    Manage
                  </button>
                </div>
              </div>
            </div>
            
            {/* Learning Link */}
            <div className="mt-6 flex items-center text-blue-600 text-sm">
              <i className="fas fa-lightbulb mr-2 text-blue-500"></i>
              <a href="#" className="hover:underline">How to effectively add data sources</a>
            </div>
          </div>
        </div>
        
        {/* Knowledge Management UI - Only show for knowledge tab */}
        {activeTab === 'knowledge' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Website URL</h2>
            
            <div className="max-w-2xl">
              <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your website URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="website-url"
                  className={`block w-full rounded-l-lg border ${isUrlValid ? 'border-green-300' : 'border-gray-300'} px-4 py-3 focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="https://example.com"
                  value={siteUrl}
                  onChange={handleUrlChange}
                />
                <button
                  onClick={handleAddKnowledge}
                  disabled={!isUrlValid || isLoading}
                  className={`rounded-r-lg px-4 py-3 font-medium text-white ${
                    isUrlValid && !isLoading 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <span>Import</span>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter the URL of your website to help Lyro learn about your business, products, and services.
              </p>
            </div>
            
            {knowledgeData.websiteUrl.count > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-medium text-gray-900 mb-4">Imported Pages ({knowledgeData.websiteUrl.count})</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Page URL
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Imported
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...Array(knowledgeData.websiteUrl.count)].map((_, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            <a href="#" className="hover:underline">{`${siteUrl}${index === 0 ? '' : '/' + ['about', 'pricing', 'contact', 'faq', 'products'][index-1]}`}</a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Processed
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date().toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Data Sources UI - Only show for datasources tab */}
        {activeTab === 'datasources' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Data Sources</h2>
                <p className="text-sm text-gray-600">Connect different data sources to improve Lyro's knowledge</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
                Add Data Source
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Website Integration */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-globe text-blue-600"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Website</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Connected</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Import content from your website pages to teach Lyro about your business.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Manage</a>
              </div>
              
              {/* Help Desk Integration */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-headset text-gray-500"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Help Desk</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Connect your help desk solution to import knowledge base articles.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Connect</a>
              </div>
              
              {/* Google Drive Integration */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-google-drive text-gray-500"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Google Drive</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Import documents from Google Drive to expand Lyro's knowledge.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Connect</a>
              </div>
              
              {/* PDF Uploads */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-file-pdf text-gray-500"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">PDF Documents</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Upload PDF documents like manuals, guides, or product specifications.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Upload</a>
              </div>
              
              {/* CRM Integration */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-users text-gray-500"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">CRM</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Connect your CRM to provide Lyro with customer data and history.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Connect</a>
              </div>
              
              {/* API Integration */}
              <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-code text-gray-500"></i>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Custom API</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Connect to a custom API endpoint to import your own data structure.</p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">Setup</a>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-yellow-500 mt-0.5">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Pro Tip</h4>
                  <p className="text-xs text-gray-600">
                    The more high-quality data sources you connect, the more effective Lyro will be at answering customer questions accurately.
                    We recommend connecting at least 3 different data sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings UI - Only show for settings tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Lyro AI Settings</h2>
            
            <div className="space-y-6 max-w-3xl">
              {/* Response Style */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Response Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border-2 border-blue-600 bg-blue-50 rounded-lg p-4 relative">
                    <div className="absolute top-2 right-2 text-blue-600">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Professional</h4>
                    <p className="text-xs text-gray-600">Formal and business-like responses</p>
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Friendly</h4>
                    <p className="text-xs text-gray-600">Casual and conversational tone</p>
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Concise</h4>
                    <p className="text-xs text-gray-600">Brief and to-the-point answers</p>
                  </div>
                </div>
              </div>
              
              {/* Language Settings */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Language Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Portuguese</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Languages</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Auto-detect visitor language</option>
                      <option>Specific languages only</option>
                      <option>English only</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Response Behavior */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Response Behavior</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Human handoff threshold</label>
                      <p className="text-xs text-gray-500">When should Lyro transfer to a human agent</p>
                    </div>
                    <div className="w-32">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Medium</option>
                        <option>Low</option>
                        <option>High</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Knowledge confidence</label>
                      <p className="text-xs text-gray-500">How confident should Lyro be before answering</p>
                    </div>
                    <div className="w-32">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">Response length</label>
                      <p className="text-xs text-gray-500">How detailed should Lyro's responses be</p>
                    </div>
                    <div className="w-32">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option>Balanced</option>
                        <option>Concise</option>
                        <option>Detailed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Channels */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Active Channels</h3>
                <p className="text-xs text-gray-600 mb-3">Select which channels Lyro should respond on</p>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked />
                    <span className="ml-2 text-sm text-gray-900">Website Chat Widget</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-900">Email</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-900">Facebook Messenger</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-900">WhatsApp</span>
                  </label>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;