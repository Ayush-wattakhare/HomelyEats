// /pages/customer/CheckoutPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderTracker from "../../components/OrderTracker";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = () => {
    alert("Payment successful! Redirecting to Dashboard...");
    navigate("/customer/dashboard");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>
      {cart.map((item, index) => (
        <div key={index} className="border p-2 rounded mb-2">
          <div className="flex justify-between">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        </div>
      ))}
      <div className="font-bold mt-4 mb-2">Total: ₹{total}</div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={handlePayment}
      >
        Pay Now
      </button>

      <OrderTracker status="Preparing" />
    </div>
  );
};

export default CheckoutPage;
