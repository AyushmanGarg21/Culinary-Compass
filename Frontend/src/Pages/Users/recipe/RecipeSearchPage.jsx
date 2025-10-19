import React from "react";
import RecipeSearch from "../../../components/RecipeSearch/RecipeSearch";
import RecipeList from "../../../components/RecipeSearch/RecipeList";

const RecipeSearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-300 text-gray-800">
        <div className="absolute inset-0 bg-white opacity-30"></div>
        <div className="relative px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            🍳 Discover Amazing Recipes
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-up animation-delay-200">
            Find the perfect recipe with ingredients you have at home
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="animate-slide-up">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/15 via-purple-200/15 to-indigo-300/15 rounded-2xl"></div>
            <div className="relative">
              <RecipeSearch />
            </div>
          </div>
        </div>
        <div className="mt-12 animate-slide-up animation-delay-300">
          <RecipeList />
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchPage;
