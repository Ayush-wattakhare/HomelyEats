import React, { useEffect, useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import './CustomerDashboard.css';
import FilterBar from "../components/FilterBar"; // adjust path as needed


const sampleMeals = [
  { id: 1, name: "Rice Plate", price: 90, type: "veg", image: "/images/rice-plate.jpg", mealSet: "Lunch" },
  { id: 2, name: "Chicken Curry Set", price: 150, type: "non-veg", image: "/images/chicken-curry.jpg", mealSet: "Dinner" },
  { id: 3, name: "Chapati Bhaji", price: 60, type: "veg", image: "/images/chapati.jpg", mealSet: "Lunch" },
  { id: 4, name: "Dal Fry & Rice", price: 70, type: "veg", image: "/images/dal-rice.jpg", mealSet: "Dinner" },
];

const orderStatuses = ["Preparing", "Out for Delivery", "Delivered"];

export default function CustomerDashboard() {
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [orderType, setOrderType] = useState("one-time");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");
  const [currentStatus, setCurrentStatus] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    setMeals(sampleMeals);
  }, []);

  const addToCart = (meal) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === meal.id);
      return existing
        ? prevCart.map((item) => item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prevCart, { ...meal, quantity: 1 }];
    });
  };
  useEffect(() => {
    const name = localStorage.getItem("customerName") || "Customer";
    setCustomerName(name);
    setMeals(sampleMeals);
  }, []);
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderDetails = {
      id: Date.now(),
      items: cart,
      orderType,
      deliveryTime,
      paymentMode,
      statusIndex: 0,
    };

    alert("Order Placed Successfully!");
    setOrderHistory([...orderHistory, orderDetails]);
    setCart([]);
    setCurrentStatus(orderDetails);
  };

  const advanceStatus = () => {
    if (currentStatus && currentStatus.statusIndex < orderStatuses.length - 1) {
      setCurrentStatus({ ...currentStatus, statusIndex: currentStatus.statusIndex + 1 });
    }
  };

  const filteredMeals = meals
  .filter((m) => {
    if (filterType === "veg") return m.type === "veg";
    if (filterType === "nonveg") return m.type === "non-veg";
    return true;
  })
  .sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="dashboard-fullscreen">
      {/* Left */}
      <div className="left-panel">
        <h1 className="logo">🍱 LunchBox</h1>
        <p className="welcome-msg">Welcome, {customerName} 👋</p><br></br>
        <h2 className="tagline">Order Your Favorite Meals</h2><br></br>

        <FilterBar
  filterType={filterType}
  setFilterType={setFilterType}
  sortOrder={sortOrder}
  setSortOrder={setSortOrder}
/>


        <div className="meals-grid">
          {filteredMeals.map((meal) => (
            <Card key={meal.id} className="meal-card">
              <img src={meal.image} alt={meal.name} className="meal-image" />
              <CardContent>
                <h2 className="meal-name">{meal.name}</h2>
                <p>Type: {meal.type}</p>
                <p>Meal Set: {meal.mealSet}</p>
                <p className="price">₹{meal.price}</p>
                <Button onClick={() => addToCart(meal)} className="orange-hover mt-2 w-full">Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="right-panel">
        <h2 className="section-title">🛒 Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                  </div>
                  <div className="cart-controls">
                    <Button size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
                    <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="total">Total: ₹{cartTotal}</p>
          </>
        )}

        <div className="form-group">
          <Label>Choose Delivery Time</Label>
          <Input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
        </div>

        <div className="form-group">
          <Label>Order Type</Label>
          <RadioGroup value={orderType} onValueChange={setOrderType}>
            <div className="radio-option">
              <RadioGroupItem value="one-time" id="one-time" />
              <Label htmlFor="one-time">One-time</Label>
            </div>
            <div className="radio-option">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly Subscription</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="form-group">
          <Label>Payment Mode</Label>
          <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
            <div className="radio-option">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
            <div className="radio-option">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online">Online Payment</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={placeOrder} className="orange-hover w-full mt-4">Place Order</Button>

        {currentStatus && (
          <div className="order-status">
            <h3>📦 Order Tracking</h3>
            <p>Current Status: {orderStatuses[currentStatus.statusIndex]}</p>
            {currentStatus.statusIndex < orderStatuses.length - 1 && (
              <Button onClick={advanceStatus} className="orange-hover mt-2">Next Status</Button>
            )}
          </div>
        )}

        <div className="order-history">
          <h3>📚 Order History</h3>
          {orderHistory.length === 0 ? (
            <p>No past orders yet.</p>
          ) : (
            <ul>
              {orderHistory.map((order, index) => (
                <li key={index}>
                  #{order.id} - {order.items.length} item(s) - {orderStatuses[order.statusIndex]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
