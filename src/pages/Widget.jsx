import React, { useState } from 'react';

const Widget = () => {
  const [activeMethod, setActiveMethod] = useState('manual');
  const [copied, setCopied] = useState(false);

  const handleMethodSelect = (method) => {
    setActiveMethod(method);
  };

  const copyCode = () => {
    const code = `<script src="//code.livechat.co/widget.js" async></script>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy: ', error);
    });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Alert Banner */}
      <div className="bg-white border border-red-200 rounded-xl p-4 md:p-5 mb-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1">Chat Widget Not Installed</h3>
            <p className="text-gray-600 text-sm">Your chat widget code hasn't been installed yet. Follow the steps below to get started and activate your live chat.</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Installation Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Installation</h2>
          <p className="text-gray-600 text-sm md:text-base mb-8">It looks like you haven't installed the chat code yet. Choose from one of the installation guides below:</p>

          {/* Installation Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Platform Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Installation Methods</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleMethodSelect('manual')} 
                  className={`w-full flex items-center space-x-4 p-4 border-2 rounded-xl transition text-left ${
                    activeMethod === 'manual' 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-code text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manual install</h4>
                    <p className="text-xs text-gray-600">Copy and paste code snippet</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleMethodSelect('shopify')}
                  className={`w-full flex items-center space-x-4 p-4 border-2 rounded-xl transition text-left ${
                    activeMethod === 'shopify' 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-shopify text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Shopify</h4>
                    <p className="text-xs text-gray-600">Install via Shopify app store</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleMethodSelect('wordpress')}
                  className={`w-full flex items-center space-x-4 p-4 border-2 rounded-xl transition text-left ${
                    activeMethod === 'wordpress' 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-wordpress text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WordPress</h4>
                    <p className="text-xs text-gray-600">Install WordPress plugin</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleMethodSelect('woocommerce')}
                  className={`w-full flex items-center space-x-4 p-4 border-2 rounded-xl transition text-left ${
                    activeMethod === 'woocommerce' 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fab fa-wordpress text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WooCommerce</h4>
                    <p className="text-xs text-gray-600">Install for WooCommerce</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column - Installation Steps */}
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                {/* Step 1 */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Paste this code snippet just before the &lt;/body&gt; tag</h3>
                      <p className="text-xs text-gray-600 mb-3">Copy the code below and paste it into your website's HTML</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-xl p-4 relative">
                    <code className="text-green-400 text-xs md:text-sm block overflow-x-auto">
                      &lt;script src="//code.livechat.co/widget.js" async&gt;&lt;/script&gt;
                    </code>
                    <button 
                      onClick={copyCode} 
                      className="absolute top-3 right-3 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-2"
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={copyCode} 
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 ${
                        copied 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-clipboard'}`}></i>
                      <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
                    </button>
                    <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 border border-gray-200">
                      <i className="fas fa-envelope"></i>
                      <span>Send via email</span>
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Go to your website to check if LiveChat is there</h3>
                      <p className="text-sm text-gray-600 mb-4">Go to your website where you've installed the chat widget code. This step is required to activate the widget.</p>
                      
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin">
                            <i className="fas fa-circle-notch text-blue-600 text-xl"></i>
                          </div>
                          <span className="text-sm text-gray-600">Checking widget activation...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-lightbulb text-yellow-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Need help?</h4>
                    <p className="text-xs text-gray-600 mb-2">Check our detailed installation guides or contact support</p>
                    <a href="#" className="text-blue-600 hover:underline text-xs font-semibold">View documentation →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;