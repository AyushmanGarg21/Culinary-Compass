import React from 'react';

const DayColumn = ({ date, mealType, meal, onMealClick, loading }) => {
  const handleClick = () => {
    onMealClick(date, mealType, meal);
  };

  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const checkDate = new Date(dateString);
    return today.toDateString() === checkDate.toDateString();
  };

  const isTodayDate = isToday(date);

  return (
    <div 
      className={`p-1 sm:p-3 min-h-[60px] sm:min-h-[80px] border-r border-gray-100 last:border-r-0 cursor-pointer transition-colors ${
        isTodayDate 
          ? 'bg-green-50 hover:bg-green-100' 
          : 'hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      {meal ? (
        <div className="space-y-1">
          <div className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2">
            {meal.name}
          </div>
          <div className="text-xs text-gray-500">
            <span>{meal.calories} cal</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg 
              className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-gray-300 mb-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            <div className="text-xs text-gray-400 hidden sm:block">Add meal</div>
            <div className="text-xs text-gray-400 sm:hidden">+</div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default DayColumn;