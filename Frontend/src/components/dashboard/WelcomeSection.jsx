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
    <div className="bg-gradient-to-r from-[#8B7ED8] via-[#A594E8] to-[#8B7ED8] rounded-2xl p-6 sm:p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden font-['Inter',_'Poppins',_sans-serif]">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0 flex-1">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 animate-fade-in text-white tracking-tight drop-shadow-lg">
            Hi {userName}! 😊
          </h1>
          <p className="text-lg sm:text-2xl opacity-95 animate-slide-up font-medium text-white drop-shadow-md">
            {getGreeting()} {getEmoji()}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-2">
          {/* Date Info - Moved to right side */}
          <div className="text-center animate-fade-in -mt-2" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm sm:text-base opacity-90 font-semibold text-white drop-shadow-sm">
              📅 {getCurrentDate()}
            </p>
          </div>

          {/* Food Icon */}
          <div className="hidden sm:block">
            <div className="w-20 h-20 bg-white bg-opacity-25 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements - More visible bubbles */}
      <div className="absolute top-4 right-4 opacity-40">
        <div className="w-10 h-10 bg-white rounded-full animate-pulse shadow-lg"></div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-35">
        <div className="w-8 h-8 bg-white rounded-full animate-pulse delay-1000 shadow-md"></div>
      </div>
      <div className="absolute top-1/2 left-8 opacity-25">
        <div className="w-6 h-6 bg-white rounded-full animate-pulse delay-500 shadow-sm"></div>
      </div>
      <div className="absolute bottom-8 right-12 opacity-30">
        <div className="w-7 h-7 bg-white rounded-full animate-pulse delay-2000 shadow-md"></div>
      </div>
    </div>
  );
};

export default WelcomeSection;