// /components/Cart.jsx
import React from "react";

const Cart = ({ cartItems, onCheckout, onRemove }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed right-4 top-20 bg-white shadow-lg rounded-lg p-4 w-80 z-50">
      <h2 className="text-lg font-bold mb-2">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart</p>
      ) : (
        <ul className="mb-2">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center border-b py-1">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <button className="text-red-500 text-sm" onClick={() => onRemove(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold mb-2">Total: ₹{total}</div>
      <button
        className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
        onClick={onCheckout}
        disabled={cartItems.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
