import React from 'react';
import { useSelector } from 'react-redux';

const WelcomeSection = () => {
  const { user, timeOfDay } = useSelector(state => state.dashboard);

  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good Morning';
      case 'afternoon':
        return 'Good Afternoon';
      case 'evening':
        return 'Good Evening';
      default:
        return 'Hello';
    }
  };

  const getEmoji = () => {
    switch (timeOfDay) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌙';
      default:
        return '😊';
    }
  };

  const userName = user?.name || 'User';

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0 flex-1">
          <h1 className="text-3xl sm:text-5xl font-bold mb-2 animate-fade-in">
            Hi {userName}! 😊
          </h1>
          <p className="text-lg sm:text-2xl opacity-90 animate-slide-up">
            {getGreeting()} {getEmoji()}
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Date Info - Moved to right side */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm sm:text-base opacity-80 font-medium">
              📅 {getCurrentDate()}
            </p>
          </div>
          
          {/* Food Icon */}
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-20">
        <div className="w-6 h-6 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default WelcomeSection;