import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMealTypeSettings } from '../../redux/features/Users/mealPlannerSlice';
import DayColumn from './DayColumn';
import MealTypeSettings from './MealTypeSettings';

const WeeklyCalendar = ({ weekPlan, onMealClick, loading }) => {
  const dispatch = useDispatch();
  const { mealTypes, showMealTypeSettings } = useSelector(state => state.mealPlanner);
  const triggerRef = useRef(null);
  
  const enabledMealTypes = mealTypes.filter(mealType => mealType.enabled);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMealTypeSettings) {
        // Check if click is outside both trigger and dropdown
        const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(event.target);
        const isOutsideDropdown = !event.target.closest('[data-meal-type-dropdown]');
        
        if (isOutsideTrigger && isOutsideDropdown) {
          dispatch(toggleMealTypeSettings());
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMealTypeSettings, dispatch]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const dates = Object.keys(weekPlan).sort();
  
  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const checkDate = new Date(dateString);
    return today.toDateString() === checkDate.toDateString();
  };

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">Loading meal plan...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden calendar-grid">
        {/* Header with meal types */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div ref={triggerRef} className="p-2 sm:p-4 bg-gray-50 font-semibold text-gray-700 relative">
            <div className="flex items-center justify-between">
              {/* Vertical text for mobile, horizontal for desktop */}
              <span className="hidden sm:block text-sm sm:text-base">Meal Type</span>
              <span className="sm:hidden text-xs vertical-text">
                Meal Type
              </span>
              <button
                onClick={() => dispatch(toggleMealTypeSettings())}
                className="text-gray-500 hover:text-gray-700 transition-colors hidden sm:block"
              >
                <svg 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showMealTypeSettings ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Mobile dropdown button */}
              <button
                onClick={() => dispatch(toggleMealTypeSettings())}
                className="sm:hidden absolute top-1 right-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg 
                  className={`w-3 h-3 transition-transform ${showMealTypeSettings ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          {dates.map((date) => {
            const dateObj = new Date(date);
            const dayName = dayNames[dateObj.getDay()];
            const shortDayName = shortDayNames[dateObj.getDay()];
            const isTodayDate = isToday(date);
            
            return (
              <div 
                key={date} 
                className={`p-1 sm:p-4 text-center ${
                  isTodayDate 
                    ? 'bg-green-50 border-b-2 border-green-300' 
                    : 'bg-gray-50'
                }`}
              >
                {/* Show short names on mobile, full names on desktop */}
                <div className={`font-semibold text-xs sm:text-base ${
                  isTodayDate ? 'text-green-800' : 'text-gray-700'
                }`}>
                  <span className="sm:hidden">{shortDayName}</span>
                  <span className="hidden sm:block">{dayName}</span>
                </div>
                <div className={`text-xs sm:text-sm ${
                  isTodayDate ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {dateObj.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meal rows */}
        {enabledMealTypes.map((mealType) => (
          <div key={mealType.key} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
            <div className={`p-2 sm:p-4 font-medium text-gray-700 ${mealType.color} flex items-center justify-center meal-type-cell`}>
              {/* Vertical text for mobile */}
              <span className="sm:hidden text-xs vertical-text">
                {mealType.label}
              </span>
              {/* Horizontal text for desktop */}
              <span className="hidden sm:block text-sm sm:text-base">
                {mealType.label}
              </span>
            </div>
            {dates.map((date) => (
              <DayColumn
                key={`${date}-${mealType.key}`}
                date={date}
                mealType={mealType.key}
                meal={weekPlan[date]?.[mealType.key]}
                onMealClick={onMealClick}
                loading={loading}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Render dropdown outside the calendar grid */}
      {showMealTypeSettings && <MealTypeSettings triggerRef={triggerRef} />}
    </>
  );
};

export default WeeklyCalendar;