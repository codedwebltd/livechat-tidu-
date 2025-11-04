import { useState, useEffect } from 'react';

export default function SimplifiedFacebookShimmer() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(!loading);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  // Simple shimmer component that works with your tailwind config
  const ShimmerItem = ({ className }) => (
    <div className={`bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 bg-shimmer-gradient bg-[length:1000px_100%] animate-shimmer" 
      />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Simplified Facebook Shimmer</h1>
          <button 
            onClick={() => setLoading(!loading)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Toggle Loading
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Header Card */}
          {loading ? (
            <div className="space-y-2">
              <ShimmerItem className="h-6 w-1/2" />
              <ShimmerItem className="h-4 w-3/4" />
              <ShimmerItem className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-600">Here's what's happening with your account today.</p>
            </div>
          )}
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(item => (
              <div key={item}>
                {loading ? (
                  <div className="space-y-3 p-4 bg-white shadow rounded-lg">
                    <div className="flex space-x-3">
                      <ShimmerItem className="w-12 h-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <ShimmerItem className="h-4 w-2/3" />
                        <ShimmerItem className="h-3 w-1/2" />
                      </div>
                    </div>
                    <ShimmerItem className="h-3 w-full" />
                    <ShimmerItem className="h-3 w-11/12" />
                    <ShimmerItem className="h-3 w-4/5" />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 shadow h-full">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{item}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Card Title {item}</h3>
                        <p className="text-sm text-blue-600">Active status</p>
                      </div>
                    </div>
                    <p className="text-gray-600">This is some card content that would normally be displayed when the content is loaded.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Stats Section */}
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6">
              <ShimmerItem className="h-6 w-1/3 mb-6" />
              <div className="space-y-6">
                {[1, 2, 3].map(item => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <ShimmerItem className="h-4 w-1/4" />
                      <ShimmerItem className="h-4 w-1/6" />
                    </div>
                    <ShimmerItem className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-6">
                {[1, 2, 3].map(item => (
                  <div key={item}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Metric {item}</span>
                      <span className="font-bold">{item * 25}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item * 25}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}