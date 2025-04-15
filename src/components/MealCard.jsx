// /components/MealCard.jsx
import React from "react";

const MealCard = ({ meal, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
      <img src={meal.image} alt={meal.name} className="w-full h-40 object-cover rounded-xl mb-2" />
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{meal.name}</h3>
        <span className="text-green-600 font-bold">₹{meal.price}</span>
      </div>
      <p className="text-sm text-gray-500">{meal.type} | {meal.time}</p>
      <button
        className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        onClick={() => onAddToCart(meal)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MealCard;