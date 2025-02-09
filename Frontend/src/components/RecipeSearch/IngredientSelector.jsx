import React from "react";

const IngredientSelector = ({ selectedIngredients, setIngredients }) => {
  const predefinedIngredients = [
    "Tomato",
    "Cheese",
    "Chicken",
    "Onion",
    "Garlic",
    "Potato",
  ];

  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Select Ingredients:</label>
      <div className="grid grid-cols-2 gap-2">
        {predefinedIngredients.map((ingredient, index) => (
          <button
            key={index}
            onClick={() => addIngredient(ingredient)}
            className="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            {ingredient}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-bold">Selected Ingredients:</h2>
        <ul className="list-disc ml-4">
          {selectedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IngredientSelector;
