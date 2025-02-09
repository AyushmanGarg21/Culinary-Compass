import React from "react";
import RecipeCard from "./RecipeCard";
import { useSelector } from "react-redux";

const RecipeList = () => {
  const { recipes, loading } = useSelector((state) => state.recipes);

  if (loading) return <p>Loading recipes...</p>;
  if (!recipes.length) return <p>No recipes found. Try different ingredients.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
