import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateMealTypeEnabled, 
  updateMealTypeSettings 
} from '../../redux/features/Users/mealPlannerSlice';

const MealTypeSettings = ({ triggerRef }) => {
  const dispatch = useDispatch();
  const { mealTypes } = useSelector(state => state.mealPlanner);
  
  const [position, setPosition] = useState({ top: -9999, left: -9999, width: 280 });
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
        setIsVisible(true);
      }
    };

    updatePosition();
  }, [triggerRef]);

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef?.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    // Update position on scroll and resize
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerRef]);

  const handleToggleMealType = (mealTypeKey, enabled) => {
    dispatch(updateMealTypeEnabled({ mealTypeKey, enabled }));
    
    // Update the settings on the backend
    const updatedMealTypes = mealTypes.map(mt => 
      mt.key === mealTypeKey ? { ...mt, enabled } : mt
    );
    dispatch(updateMealTypeSettings(updatedMealTypes));
  };

  return (
    <div 
      data-meal-type-dropdown
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        top: `${position.top + 4}px`,
        left: `${position.left}px`,
        minWidth: `${Math.max(position.width, 280)}px`,
        maxWidth: '400px'
      }}
    >
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Customize Meal Types</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {mealTypes.map((mealType) => (
            <label key={mealType.key} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={mealType.enabled}
                onChange={(e) => handleToggleMealType(mealType.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{mealType.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Select which meal types to display in your weekly planner
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealTypeSettings;