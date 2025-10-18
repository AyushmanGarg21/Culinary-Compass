import React, { useRef } from "react";
import RecipeCard from "./RecipeCard";
import { useSelector } from "react-redux";

const RecipeList = () => {
  const { recipes, loading, error } = useSelector((state) => state.recipes);
  const recipeScrollRef = useRef(null);

  const scrollLeft = () => {
    if (recipeScrollRef.current) {
      recipeScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (recipeScrollRef.current) {
      recipeScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🍳</span>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-600 animate-pulse">
          Cooking up some amazing recipes for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
        <p className="text-gray-600 mb-6">
          Try different ingredients or adjust your dietary preferences
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-green-700">
            💡 <strong>Tip:</strong> Try popular ingredients like chicken, tomato, or cheese!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-violet-100">
        <h2 className="text-xl font-bold text-gray-800">
          🍽️ Recipe Results
        </h2>
      </div>

      {/* Recipe horizontal scroll */}
      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          ref={recipeScrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id || index}
              className="flex-shrink-0 w-80 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
        
        {/* Gradient fade on right */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default RecipeList;
