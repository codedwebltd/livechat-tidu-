import React, { useState, useEffect } from 'react';

const BlogPostCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  
  // Our blog posts data
  const blogPosts = [
    {
      id: 1,
      backgroundColor: "from-blue-100 to-blue-50",
      title: "Explore free tools and insights for peak season success",
      link: "Get holiday season ready →"
    },
    {
      id: 2,
      backgroundColor: "from-gray-900 to-blue-900",
      title: "Reach 50%+ support automation within a month",
      link: "Discover LiveChat Premium →"
    },
    {
      id: 3,
      backgroundColor: "from-gray-100 to-gray-200",
      title: "Discover how to leverage AI Chatbot to elevate your customer service",
      link: "Start free course →"
    },
    {
      id: 4,
      backgroundColor: "from-green-500 to-emerald-600",
      title: "Handle Facebook and Instagram comments in your Inbox!",
      link: "Learn more →"
    }
  ];

  // Update slides per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Make sure we don't go past the end
  useEffect(() => {
    const maxSlide = Math.max(0, blogPosts.length - slidesPerView);
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [slidesPerView, currentSlide, blogPosts.length]);

  const nextSlide = () => {
    const maxSlide = blogPosts.length - slidesPerView;
    if (currentSlide < maxSlide) {
      setCurrentSlide(prevSlide => prevSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prevSlide => prevSlide - 1);
    }
  };

  // Calculate visible posts
  const visiblePosts = blogPosts.slice(currentSlide, currentSlide + slidesPerView);

  return (
    <div className="mb-10">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Blog Posts</h3>
      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition h-full">
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-br ${post.backgroundColor} overflow-hidden`}>
                  {post.id === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full flex items-center justify-center p-6">
                        <div className="absolute top-4 right-4 w-24 h-24 bg-blue-400 rounded-3xl opacity-20 rotate-12"></div>
                        <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
                        <div className="relative bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <i className="fas fa-gifts text-white text-sm"></i>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Holiday</span>
                          </div>
                          <div className="bg-green-500 text-white text-2xl font-bold rounded-lg p-3 text-center">
                            50%
                          </div>
                          <p className="text-xs text-gray-600 mt-2">Customer Service</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {post.id === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-20 translate-x-8 -translate-y-8"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full opacity-20 -translate-x-4 translate-y-4"></div>
                      <div className="relative text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-3 shadow-xl">
                          <i className="fas fa-dollar-sign text-white text-2xl"></i>
                        </div>
                        <div className="bg-green-500 text-white px-4 py-2 rounded-xl inline-block shadow-lg">
                          <span className="text-2xl font-bold">50%+</span>
                          <p className="text-xs mt-1">support automation</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {post.id === 3 && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-[220px] transform -rotate-3">
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                          <i className="fas fa-graduation-cap text-white"></i>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-robot text-white"></i>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">LiveChat - Academy</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          <p className="font-semibold text-sm text-gray-900 mb-1">Empowered Customer Service</p>
                          <p className="text-blue-600 font-medium">with Lyro AI Chatbot</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {post.id === 4 && (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="absolute top-4 right-4 w-20 h-20 bg-white opacity-10 rounded-2xl rotate-12"></div>
                      <div className="relative bg-white rounded-2xl shadow-xl p-4 max-w-[200px]">
                        <div className="flex items-center justify-between mb-3">
                          <i className="fab fa-facebook text-blue-600 text-2xl"></i>
                          <i className="fab fa-instagram text-pink-600 text-2xl"></i>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-xs text-gray-700">New comment: I've been waiting for it! 🤩</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <i className="fas fa-comment text-white text-xs"></i>
                          </div>
                          <p className="text-xs text-gray-500">From comment to Facebook post</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-900 font-medium text-sm mb-4 leading-relaxed">{post.title}</p>
                  <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">{post.link}</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - only show if needed */}
        {currentSlide > 0 && (
          <button 
            onClick={prevSlide} 
            className="absolute left-0 top-1/3 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition z-10 border border-gray-200"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        {currentSlide < blogPosts.length - slidesPerView && (
          <button 
            onClick={nextSlide} 
            className="absolute right-0 top-1/3 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition z-10 border border-gray-200"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}

        {/* Dots Indicator - only if we have more slides than can be shown */}
        {blogPosts.length > slidesPerView && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: blogPosts.length - slidesPerView + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === i 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostCarousel;