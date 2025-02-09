import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRecipes } from "../../redux/features/Users/recipeSlice";
import IngredientSelector from "./IngredientSelector";

const RecipeSearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [dietaryPreference, setDietaryPreference] = useState("None");
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(fetchRecipes({ ingredients, dietaryPreference }));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Recipe Search</h1>
      <IngredientSelector
        selectedIngredients={ingredients}
        setIngredients={setIngredients}
      />
      <div>
        <label className="block mb-2 font-semibold">Dietary Preference:</label>
        <select
          value={dietaryPreference}
          onChange={(e) => setDietaryPreference(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="None">None</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Search Recipes
      </button>
    </div>
  );
};

export default RecipeSearch;
