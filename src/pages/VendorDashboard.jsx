// VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "veg",
    time: "",
    mealSet: "",
    image: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [vendorName, setVendorName] = useState("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVendorName(res.data.businessName || res.data.name);
      } catch (error) {
        console.error("Vendor Info Error:", error);
      }
    };

    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/vendor/menu", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenu(res.data.items || []);
      } catch (err) {
        console.error("Menu Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editIndex !== null) {
        const updated = [...menu];
        const itemId = updated[editIndex]._id;
        const res = await API.put(`/vendor/menu/${itemId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updated[editIndex] = res.data.item;
        setMenu(updated);
        setEditIndex(null);
      } else {
        const res = await API.post("/vendor/menu", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenu([...menu, res.data.item]);
      }

      setFormData({
        name: "",
        price: "",
        type: "veg",
        time: "",
        mealSet: "",
        image: "",
      });
    } catch (error) {
      console.error("Save Meal Error:", error);
      alert("Failed to save meal.");
    }
  };

  const handleEdit = (index) => {
    setFormData(menu[index]);
    setEditIndex(index);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/vendor/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(menu.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete Meal Error:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.put(`/vendor/menu/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(menu.map((item) => (item._id === id ? res.data.item : item)));
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  const handlePayment = async (meal) => {
    const res = await API.post("/payment", { amount: meal.price });
    const options = {
      key: "RAZORPAY_KEY_ID",
      amount: meal.price * 100,
      currency: "INR",
      name: "LunchBox",
      description: `Payment for ${meal.name}`,
      order_id: res.data.order_id,
      handler: function (response) {
        alert("Payment Successful!");
      },
      theme: {
        color: "#f97316",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="vendor-dashboard">
      <h2 className="dashboard-title">👨‍🍳 Welcome, {vendorName}</h2>

      <form onSubmit={handleAddOrUpdate} className="meal-form">
        <h3 className="form-heading">{editIndex !== null ? "Edit Meal" : "Add New Meal"}</h3>
        <div className="form-grid">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Meal Name" required />
          <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
          <input name="time" value={formData.time} onChange={handleChange} placeholder="Delivery Time" />
          <input name="mealSet" value={formData.mealSet} onChange={handleChange} placeholder="Meal Set (e.g., Rice Plate)" />
          <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />
        </div>
        <button type="submit" className="submit-button">
          {editIndex !== null ? "Update Meal" : "Add Meal"}
        </button>
      </form>

      <h3 className="meals-heading">📦 Your Meals</h3>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : menu.length === 0 ? (
        <p className="no-meals-text">No meals added yet.</p>
      ) : (
        <div className="meal-grid">
          {menu.map((item, index) => (
            <div key={index} className="meal-card">
              <img src={item.image} alt={item.name} className="meal-image" />
              <h4 className="meal-title">{item.name}</h4>
              <p className="meal-desc">₹{item.price} | {item.mealSet} | {item.time}</p>
              <span className={`meal-tag ${item.type === "veg" ? "veg" : "non-veg"}`}>{item.type.toUpperCase()}</span>
              {item.status && <p className="meal-status">Status: {item.status}</p>}
              <div className="status-buttons">
                <button onClick={() => updateStatus(item._id, "Preparing")}>Preparing</button>
                <button onClick={() => updateStatus(item._id, "Out for delivery")}>Out for Delivery</button>
                <button onClick={() => updateStatus(item._id, "Delivered")}>Delivered</button>
              </div>
              <div className="action-buttons">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
                <button onClick={() => handlePayment(item)}>Pay Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
