import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg">
      <h2 className="text-lg font-bold">{recipe.title}</h2>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <p className="mt-2">{recipe.description}</p>
      <button className="bg-green-500 text-white py-1 px-3 rounded-lg mt-4">
        View Recipe
      </button>
    </div>
  );
};

export default RecipeCard;
