import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleMealCompletionLocal,
  saveMealCompletions
} from '../../redux/features/Users/dashboardSlice';

const TodaysMeals = ({ onEditMeals }) => {
  const dispatch = useDispatch();
  const { todaysMeals, saving } = useSelector(state => state.dashboard);

  const handleToggleMeal = (mealId) => {
    dispatch(toggleMealCompletionLocal({ mealId }));
  };

  const handleSaveCompletions = () => {
    dispatch(saveMealCompletions());
  };

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: 'Breakfast',
      brunch: 'Brunch',
      elevenses: 'Elevenses',
      lunch: 'Lunch',
      afternoonTea: 'Afternoon Tea',
      highTea: 'High Tea',
      dinner: 'Dinner',
      supper: 'Supper',
      midnightSnack: 'Midnight Snack'
    };
    return labels[mealType] || mealType;
  };

  const getMealTypeIcon = (mealType) => {
    const icons = {
      breakfast: '🥞',
      brunch: '🥐',
      elevenses: '☕',
      lunch: '🥗',
      afternoonTea: '🫖',
      highTea: '🍰',
      dinner: '🍽️',
      supper: '🥛',
      midnightSnack: '🍪'
    };
    return icons[mealType] || '🍴';
  };

  const completedCount = todaysMeals.filter(meal => meal.completed).length;
  const totalCount = todaysMeals.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Meals</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button
          onClick={onEditMeals}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {todaysMeals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 mb-2">No meals planned for today</p>
          <p className="text-xs text-gray-400 mb-4">
            Meals shown here are synced from your saved meal planner
          </p>
          <button
            onClick={onEditMeals}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Plan Your Meals
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {todaysMeals.map((mealItem, index) => (
              <div
                key={mealItem.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${mealItem.completed
                  ? 'bg-green-50 border-green-200 shadow-md'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getMealTypeIcon(mealItem.mealType)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {getMealTypeLabel(mealItem.mealType)}
                      </h3>
                      <p className="text-gray-700">{mealItem.meal.name}</p>
                      <p className="text-sm text-gray-500">{mealItem.meal.calories} calories</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleMeal(mealItem.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${mealItem.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                      }`}
                  >
                    {mealItem.completed && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSaveCompletions}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Save Progress</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              💡 Meals are synced from your meal planner. Save progress to track completion.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default TodaysMeals;