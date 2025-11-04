import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('company');
  const [formData, setFormData] = useState({
    company_name: '',
    industry: 'E-commerce',
    team_size: '2-5 employees',
    website: '',
    primary_goal: 'Improve customer support',
    widget_position: 'right',
    primary_color: '#3B82F6',
    chat_icon: 'comments',
    welcome_message: 'Hi there! How can I help you today?'
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [stepComplete, setStepComplete] = useState({
    company: false,
    website: false,
    appearance: false,
    finish: true // Final step is always complete
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

  // Fetch existing onboarding data on component mount
  useEffect(() => {
    const fetchOnboardingData = async () => {
      setLoading(true);
      try {
        const onboardingData = await authService.getOnboardingData();
        if (onboardingData) {
          // Map API data to form fields
          setFormData({
            company_name: onboardingData.company_name || '',
            industry: onboardingData.industry || 'E-commerce',
            team_size: onboardingData.team_size || '2-5 employees',
            website: onboardingData.website || '',
            primary_goal: onboardingData.primary_goal || 'Improve customer support',
            widget_position: onboardingData.widget_position || 'right',
            primary_color: onboardingData.primary_color || '#3B82F6',
            chat_icon: onboardingData.chat_icon || 'comments',
            welcome_message: onboardingData.welcome_message || 'Hi there! How can I help you today?'
          });
          
          // Set current step
          setCurrentStep(onboardingData.current_step || 'company');
          
          // Check completion status
          updateStepCompletion({
            company_name: onboardingData.company_name || '',
            industry: onboardingData.industry || 'E-commerce',
            team_size: onboardingData.team_size || '2-5 employees',
            website: onboardingData.website || '',
            primary_goal: onboardingData.primary_goal || 'Improve customer support',
            widget_position: onboardingData.widget_position || 'right',
            primary_color: onboardingData.primary_color || '#3B82F6',
            chat_icon: onboardingData.chat_icon || 'comments'
          });
        }
      } catch (error) {
        console.error('Failed to fetch onboarding data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOnboardingData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Update step completion status
    updateStepCompletion(updatedFormData);
  };

  // Update completion status based on filled fields
  const updateStepCompletion = (data = formData) => {
    setStepComplete({
      company: !!(data.company_name && data.industry && data.team_size),
      website: !!(data.website && data.primary_goal),
      appearance: !!(data.primary_color && data.chat_icon),
      finish: true // Final step is always complete
    });
  };

  // Handle icon selection
  const handleIconSelect = (iconId) => {
    const updatedFormData = {
      ...formData,
      chat_icon: iconId
    };
    
    setFormData(updatedFormData);
    updateStepCompletion(updatedFormData);
  };

  // Handle position selection
  const handlePositionSelect = (position) => {
    const updatedFormData = {
      ...formData,
      widget_position: position
    };
    
    setFormData(updatedFormData);
    updateStepCompletion(updatedFormData);
  };

  // Save current step to the server
  const saveCurrentStep = async () => {
    setSaveLoading(true);
    
    try {
      // Prepare data to send to API
      const dataToSend = {
        ...formData,
        current_step: currentStep
      };
      
      // Call API to update onboarding step
      const result = await authService.updateOnboarding(dataToSend);
      
      if (!result.success) {
        console.error('Failed to save onboarding step:', result.message);
      }
    } catch (error) {
      console.error('Error saving onboarding step:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle next step
  const handleNextStep = async () => {
    // Save current step data first
    await saveCurrentStep();
    
    // Navigate to next step
    if (currentStep === 'company') {
      setCurrentStep('website');
    } else if (currentStep === 'website') {
      setCurrentStep('appearance');
    } else if (currentStep === 'appearance') {
      setCurrentStep('finish');
    } else {
      handleFinish();
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep === 'website') {
      setCurrentStep('company');
    } else if (currentStep === 'appearance') {
      setCurrentStep('website');
    } else if (currentStep === 'finish') {
      setCurrentStep('appearance');
    }
  };

  // Handle skip onboarding
  const handleSkip = async () => {
    setLoading(true);
    
    try {
      // Call API to skip onboarding
      const result = await authService.skipOnboarding();
      
      if (result.success) {
        navigate('/');
      } else {
        
        console.error('Failed to skip onboarding:', result.message);
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle finish onboarding
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      // Prepare final data with completed flag
      const finalData = {
        ...formData,
        current_step: 'finish',
      };
      
      // Call API to complete onboarding
      const result = await authService.updateOnboarding(finalData);
      
      if (result.success) {
        navigate('/');
      } else {
        console.error('Failed to complete onboarding:', result.message);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage based on current step
  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'company': return 0;
      case 'website': return 33;
      case 'appearance': return 66;
      case 'finish': return 100;
      default: return 0;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your setup...</p>
        </div>
      </div>
    );
  }

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
              disabled={loading}
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
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span className={`${currentStep === 'company' ? 'text-blue-600 font-medium' : stepComplete.company ? 'text-green-600 font-medium' : ''}`}>Company</span>
            <span className={`${currentStep === 'website' ? 'text-blue-600 font-medium' : stepComplete.website ? 'text-green-600 font-medium' : ''}`}>Website & Goals</span>
            <span className={`${currentStep === 'appearance' ? 'text-blue-600 font-medium' : stepComplete.appearance ? 'text-green-600 font-medium' : ''}`}>Appearance</span>
            <span className={`${currentStep === 'finish' ? 'text-blue-600 font-medium' : ''}`}>Finish</span>
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
                  onClick={() => setCurrentStep('company')}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 'company' 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete.company
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete.company 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 'company'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete.company ? (
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
                  onClick={() => setCurrentStep('website')}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 'website' 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete.website
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete.website 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 'website'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete.website ? (
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
                  onClick={() => setCurrentStep('appearance')}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 'appearance' 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : stepComplete.appearance
                        ? 'bg-green-50 border-green-200 border text-green-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    stepComplete.appearance 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === 'appearance'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepComplete.appearance ? (
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
                  onClick={() => setCurrentStep('finish')}
                  className={`w-full flex items-center p-3 rounded-lg transition ${
                    currentStep === 'finish' 
                      ? 'bg-blue-50 border-blue-200 border text-blue-700' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    currentStep === 'finish'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <span>4</span>
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
              {currentStep === 'company' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tell us about your company</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        value={formData.company_name}
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
                      <label htmlFor="team_size" className="block text-sm font-medium text-gray-700 mb-1">
                        Team Size *
                      </label>
                      <select
                        id="team_size"
                        name="team_size"
                        value={formData.team_size}
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
              {currentStep === 'website' && (
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
                      <label htmlFor="primary_goal" className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Goal *
                      </label>
                      <select
                        id="primary_goal"
                        name="primary_goal"
                        value={formData.primary_goal}
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
              {currentStep === 'appearance' && (
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
                          style={{ backgroundColor: formData.primary_color }}
                        ></div>
                        <input
                          type="text"
                          name="primary_color"
                          value={formData.primary_color}
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
                            formData.widget_position === 'right' 
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
                            formData.widget_position === 'left' 
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
                              formData.chat_icon === icon.id 
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
                      <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700 mb-1">
                        Welcome Message
                      </label>
                      <input
                        id="welcome_message"
                        name="welcome_message"
                        type="text"
                        value={formData.welcome_message}
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
                          <div className="h-10 flex items-center justify-between px-3" style={{ backgroundColor: formData.primary_color }}>
                            <span className="text-white text-sm font-medium">{formData.company_name || 'LiveChat'}</span>
                            <button className="text-white opacity-70 hover:opacity-100">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="bg-gray-100 rounded p-2 mb-2 text-sm">
                              {formData.welcome_message}
                            </div>
                          </div>
                        </div>
                        
                        {/* Chat button */}
                        <div 
                          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                          style={{ backgroundColor: formData.primary_color }}
                        >
                          <i className={`fas fa-${formData.chat_icon} text-white`}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Finish */}
              {currentStep === 'finish' && (
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
              
              {/* Autosave Indicator */}
              {saveLoading && currentStep !== 'finish' && (
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              )}
              
              {/* Navigation Buttons */}
              {currentStep !== 'finish' && (
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 'company' || loading}
                    className={`px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm ${
                      currentStep === 'company' || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 'company' && !stepComplete.company) ||
                      (currentStep === 'website' && !stepComplete.website) ||
                      (currentStep === 'appearance' && !stepComplete.appearance) ||
                      loading
                    }
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm ${
                      ((currentStep === 'company' && !stepComplete.company) ||
                      (currentStep === 'website' && !stepComplete.website) ||
                      (currentStep === 'appearance' && !stepComplete.appearance) ||
                      loading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {saveLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Continue'
                    )}
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