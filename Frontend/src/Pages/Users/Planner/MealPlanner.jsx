import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MealPlanner.css';
import {
  fetchMealTypes,
  fetchMealOptions,
  fetchWeeklyPlan,
  copyPreviousWeek,
  setEditingMeal,
  saveWeeklyPlan
} from '../../../redux/features/Users/mealPlannerSlice';
import WeeklyCalendar from '../../../components/MealPlanner/WeeklyCalendar';
import MealEditModal from '../../../components/MealPlanner/MealEditModal';
import LoadingSpinner from '../../../components/common/LoadingSpinner'

const MealPlanner = () => {
  const dispatch = useDispatch();
  const {
    currentWeekPlan,
    currentWeekOffset,
    loading,
    saving,
    error,
    editingMeal,
    lastSaved
  } = useSelector(state => state.mealPlanner);

  useEffect(() => {
    dispatch(fetchMealTypes());
    dispatch(fetchMealOptions());
    dispatch(fetchWeeklyPlan(0));
  }, [dispatch]);

  const handlePreviousWeek = () => {
    dispatch(fetchWeeklyPlan(currentWeekOffset - 1));
  };

  const handleNextWeek = () => {
    dispatch(fetchWeeklyPlan(currentWeekOffset + 1));
  };

  const handleCopyPreviousWeek = () => {
    dispatch(copyPreviousWeek());
    // In a real implementation, this would copy actual data
    alert('Previous week plan copied! (Feature simulated)');
  };

  const handleSaveWeeklyPlan = () => {
    dispatch(saveWeeklyPlan());
  };

  const handleMealClick = (date, mealType, currentMeal) => {
    dispatch(setEditingMeal({ date, mealType, currentMeal }));
  };

  if (loading && Object.keys(currentWeekPlan).length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-3 sm:mb-6">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <h1 className="text-xl font-bold text-gray-900 text-center mb-3">Meal Planner</h1>
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousWeek}
                className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyPreviousWeek}
                  title="Copy Previous Week"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <button
                  onClick={handleSaveWeeklyPlan}
                  disabled={saving}
                  title="Save Weekly Plan"
                  className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors"
                >
                  {saving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={handleNextWeek}
                className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <button
              onClick={handlePreviousWeek}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Week
            </button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Meal Planner</h1>
              {lastSaved && (
                <p className="text-xs text-gray-500 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyPreviousWeek}
                title="Copy Previous Week"
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={handleSaveWeeklyPlan}
                disabled={saving}
                title="Save Weekly Plan"
                className="p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors group"
              >
                {saving ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNextWeek}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Next Week
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Weekly Calendar */}
        <WeeklyCalendar
          weekPlan={currentWeekPlan}
          onMealClick={handleMealClick}
          loading={loading}
        />

        {/* Edit Modal */}
        {editingMeal && (
          <MealEditModal />
        )}
      </div>
    </div>
  );
};

export default MealPlanner;