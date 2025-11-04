import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'E-commerce',
    teamSize: '2-5 employees',
    website: '',
    goal: 'Improve customer support',
    widgetPosition: 'right',
    primaryColor: '#3B82F6',
    chatIcon: 'comments',
    welcomeMessage: 'Hi there! How can I help you today?'
  });

  const [loading, setLoading] = useState(false);
  const [stepComplete, setStepComplete] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  const industries = [
    'E-commerce', 
    'SaaS', 
    'Healthcare', 
    'Finance', 
    'Education', 
    'Real Estate', 
    'Travel', 
    'Retail', 
    'Other'
  ];
  
  const teamSizes = [
    'Just me',
    '2-5 employees',
    '6-20 employees',
    '21-100 employees',
    '100+ employees'
  ];
  
  const goals = [
    'Improve customer support',
    'Increase sales conversions',
    'Automate repetitive questions',
    'Collect user feedback',
    'Reduce support costs'
  ];

  const chatIcons = [
    { id: 'comments', name: 'Chat Bubble', icon: 'comments' },
    { id: 'headset', name: 'Support', icon: 'headset' },
    { id: 'comment-dots', name: 'Messages', icon: 'comment-dots' },
    { id: 'concierge-bell', name: 'Service', icon: 'concierge-bell' },
    { id: 'user-circle', name: 'User', icon: 'user-circle' }
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update step completion status
    updateStepCompletion();
  };

  // Update completion status based on filled fields
  const updateStepCompletion = () => {
    setStepComplete({
      1: !!(formData.companyName && formData.industry && formData.teamSize),
      2: !!(formData.website && formData.goal),
      3: !!(formData.primaryColor && formData.chatIcon),
      4: true // Final step is always complete
    });
  };

  // Handle icon selection
  const handleIconSelect = (iconId) => {
    setFormData({
      ...formData,
      chatIcon: iconId
    });
    updateStepCompletion();
  };

  // Handle position selection
  const handlePositionSelect = (position) => {
    setFormData({
      ...formData,
      widgetPosition: position
    });
    updateStepCompletion();
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skip onboarding
  const handleSkip = () => {
    navigate('/');
  };

  // Handle finish onboarding
  const handleFinish = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to LiveChat!</h1>
              <p className="text-gray-500 mt-1">Let's set up your account in a few quick steps</p>
            </div>
            <button 
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span className={`${currentStep >= 1 ? 'text-blue-600 font-medium' : ''}`}>Company</span>
            <span className={`${currentStep >= 2 ? 'text-blue-600 font-medium' : ''}`}>Website & Goals</span>
            <span className={`${currentStep >= 3 ? 'text-blue-600 font-medium' : ''}`}>Appearance</span>
            <span className={`${currentStep >= 4 ? 'text-blue-600 font-medium' : ''}`}>Finish</span>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Steps</h2>
              
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 1 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete[1]
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete[1] 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 1
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete[1] ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <span>1</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Company Information</h3>
                    <p className="text-xs opacity-80">Tell us about your business</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentStep(2)}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 2 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete[2]
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete[2] 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 2
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete[2] ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Website & Goals</h3>
                    <p className="text-xs opacity-80">Set your website and objectives</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentStep(3)}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 3 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete[3]
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete[3] 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 3
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete[3] ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <span>3</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Widget Appearance</h3>
                    <p className="text-xs opacity-80">Customize the look and feel</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentStep(4)}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 4 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete[4]
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete[4] 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 4
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete[4] ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <span>4</span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Finish Setup</h3>
                    <p className="text-xs opacity-80">Complete your configuration</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Current Step Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tell us about your company</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                        Industry *
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                        Team Size *
                      </label>
                      <select
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        {teamSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Website & Goals */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Website & Goals</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL *
                      </label>
                      <input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="https://example.com"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        We'll use this to help configure your chat widget and AI agent
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Goal *
                      </label>
                      <select
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        {goals.map(goal => (
                          <option key={goal} value={goal}>{goal}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0 text-blue-500">
                          <i className="fas fa-info-circle mt-1"></i>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Why this matters</h3>
                          <p className="mt-1 text-sm text-blue-700">
                            Understanding your goals helps us configure your LiveChat dashboard and AI agent for optimal results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Widget Appearance */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Widget Appearance</h2>
                  
                  <div className="space-y-6">
                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg mr-3 cursor-pointer border border-gray-300"
                          style={{ backgroundColor: formData.primaryColor }}
                        ></div>
                        <input
                          type="text"
                          name="primaryColor"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          className="block w-28 rounded-md border border-gray-200 py-2 px-3 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Widget Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chat Widget Position
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handlePositionSelect('right')}
                          className={`aspect-video border-2 ${
                            formData.widgetPosition === 'right' 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } rounded-lg p-4 relative transition`}
                        >
                          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <i className="fas fa-comments text-white text-xs"></i>
                          </div>
                          <span className="absolute bottom-1 left-1 text-xs">Right corner</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handlePositionSelect('left')}
                          className={`aspect-video border-2 ${
                            formData.widgetPosition === 'left' 
                              ? 'border-blue-600 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } rounded-lg p-4 relative transition`}
                        >
                          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <i className="fas fa-comments text-white text-xs"></i>
                          </div>
                          <span className="absolute bottom-1 left-1 text-xs">Left corner</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Chat Icon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chat Icon
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {chatIcons.map(icon => (
                          <button
                            key={icon.id}
                            type="button"
                            onClick={() => handleIconSelect(icon.id)}
                            className={`border ${
                              formData.chatIcon === icon.id 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            } rounded-lg p-2 flex flex-col items-center transition`}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                              <i className={`fas fa-${icon.icon} text-white`}></i>
                            </div>
                            <span className="text-xs font-medium">{icon.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Welcome Message */}
                    <div>
                      <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Welcome Message
                      </label>
                      <input
                        id="welcomeMessage"
                        name="welcomeMessage"
                        type="text"
                        value={formData.welcomeMessage}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preview
                      </label>
                      <div className="bg-gray-100 rounded-lg p-6 flex justify-end relative h-64">
                        {/* Chat window preview */}
                        <div className="absolute bottom-16 right-12 w-64 bg-white rounded-lg shadow-lg overflow-hidden" style={{ display: 'none' }}>
                          <div className="h-10 flex items-center justify-between px-3" style={{ backgroundColor: formData.primaryColor }}>
                            <span className="text-white text-sm font-medium">{formData.companyName || 'LiveChat'}</span>
                            <button className="text-white opacity-70 hover:opacity-100">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="bg-gray-100 rounded p-2 mb-2 text-sm">
                              {formData.welcomeMessage}
                            </div>
                          </div>
                        </div>
                        
                        {/* Chat button */}
                        <div 
                          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          <i className={`fas fa-${formData.chatIcon} text-white`}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Finish */}
              {currentStep === 4 && (
                <div>
                  <div className="text-center py-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-green-600 text-xl"></i>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-bold text-gray-900">Setup Complete!</h2>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      You're all set to start providing amazing customer support with LiveChat!
                    </p>

                    <div className="mt-8 grid gap-6 max-w-md mx-auto">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                          </div>
                          <div className="ml-3 text-left">
                            <h3 className="text-sm font-medium text-blue-800">Next Steps</h3>
                            <ul className="mt-2 text-sm text-blue-700 space-y-1">
                              <li className="flex">
                                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                                <span>Set up your LiveChat account</span>
                              </li>
                              <li className="flex">
                                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                                <span>Configure your widget appearance</span>
                              </li>
                              <li className="flex">
                                <i className="fas fa-circle text-blue-300 mt-0.5 mr-2"></i>
                                <span>Install the chat widget on your website</span>
                              </li>
                              <li className="flex">
                                <i className="fas fa-circle text-blue-300 mt-0.5 mr-2"></i>
                                <span>Set up your AI agent for automation</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleFinish}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex justify-center items-center"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Finishing setup...
                          </>
                        ) : (
                          'Go to dashboard'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              {currentStep !== 4 && (
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm ${
                      currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;