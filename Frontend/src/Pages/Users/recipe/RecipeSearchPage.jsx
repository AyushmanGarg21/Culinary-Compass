import React from "react";
import RecipeSearch from "../../../components/RecipeSearch/RecipeSearch";
import RecipeList from "../../../components/RecipeSearch/RecipeList";

const RecipeSearchPage = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <RecipeSearch />
      <div className="mt-8">
        <RecipeList />
      </div>
    </div>
  );
};

export default RecipeSearchPage;
