// /components/OrderTracker.jsx
import React from "react";

const OrderTracker = ({ status }) => {
  const steps = ["Preparing", "Out for delivery", "Delivered"];

  return (
    <div className="flex justify-between items-center my-4">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 text-center">
          <div className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center ${status === step || steps.indexOf(status) > index ? "bg-green-500 text-white" : "bg-gray-300"}`}>
            {index + 1}
          </div>
          <div className="text-sm mt-1">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderTracker;
