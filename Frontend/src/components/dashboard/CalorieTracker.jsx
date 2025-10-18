import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateCalorieTarget, 
  navigateDate, 
  fetchCaloriesForDate,
  calculateConsumedCalories 
} from '../../redux/features/Users/dashboardSlice';

const CalorieTracker = () => {
  const dispatch = useDispatch();
  const { calorieTarget, consumedCalories, selectedDate, calorieHistory } = useSelector(state => state.dashboard);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(calorieTarget);
  const [animatedCalories, setAnimatedCalories] = useState(0);

  // Load calories for selected date on mount and when date changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // For today, NEVER fetch calories - they're ALWAYS calculated from meals
    if (selectedDate === today) {
      // Ensure today's calories are recalculated from current meal completions
      dispatch(calculateConsumedCalories());
      return;
    }
    
    // For other dates (past only), fetch from backend if not cached
    if (!calorieHistory[selectedDate]) {
      dispatch(fetchCaloriesForDate(selectedDate));
    }
  }, [selectedDate, dispatch, calorieHistory]);

  // Use calories from history for selected date, always calculate from meals for today
  const today = new Date().toISOString().split('T')[0];
  const displayCalories = selectedDate === today ? consumedCalories : (calorieHistory[selectedDate] || 0);
  
  const percentage = Math.min((displayCalories / calorieTarget) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const canNavigateNext = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0] <= today;
  };

  const handlePrevDay = () => {
    dispatch(navigateDate('prev'));
  };

  const handleNextDay = () => {
    if (canNavigateNext()) {
      dispatch(navigateDate('next'));
    }
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    const isToday = selectedDate === today;
    
    if (isToday) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = selectedDate === yesterday.toISOString().split('T')[0];
    
    if (isYesterday) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Animate the calorie counter
  useEffect(() => {
    let start = animatedCalories;
    const end = displayCalories;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (end - start) * easeOutQuart);
      
      setAnimatedCalories(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [displayCalories]);

  const handleSaveTarget = () => {
    if (tempTarget > 0) {
      dispatch(updateCalorieTarget(tempTarget));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempTarget(calorieTarget);
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCircleColor = () => {
    if (percentage >= 100) return '#dc2626';
    if (percentage >= 80) return '#ea580c';
    if (percentage >= 60) return '#d97706';
    return '#16a34a';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Daily Calories</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center mb-6 bg-gray-50 rounded-lg p-3">
        <button
          onClick={handlePrevDay}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="mx-4 text-center min-w-[120px]">
          <div className="font-semibold text-gray-900">{formatSelectedDate()}</div>
          <div className="text-xs text-gray-500">
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        <button
          onClick={handleNextDay}
          disabled={!canNavigateNext()}
          className={`p-2 rounded-lg transition-all duration-200 ${
            canNavigateNext()
              ? 'text-gray-600 hover:text-gray-900 hover:bg-white'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getCircleColor()}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))'
              }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {animatedCalories}
            </div>
            <div className="text-sm text-gray-500">
              / {calorieTarget}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mb-4">
        {percentage >= 100 ? (
          <p className="text-red-600 font-medium">🎯 Target reached!</p>
        ) : percentage >= 80 ? (
          <p className="text-orange-600 font-medium">🔥 Almost there!</p>
        ) : percentage >= 50 ? (
          <p className="text-yellow-600 font-medium">💪 Keep going!</p>
        ) : (
          <p className="text-green-600 font-medium">🌱 Great start!</p>
        )}
      </div>

      {/* Remaining Calories */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-600 mb-1">Remaining</div>
        <div className="text-lg font-semibold text-gray-900">
          {Math.max(0, calorieTarget - displayCalories)} cal
        </div>
      </div>

      {/* Edit Target Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Calorie Target</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Target (calories)
              </label>
              <input
                type="number"
                value={tempTarget}
                onChange={(e) => setTempTarget(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="500"
                max="5000"
                step="50"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTarget}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieTracker;