import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"> 🍱LunchBox</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="#">Orders</Link></li>
          <li><Link to="/vendors">Vendors</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <button className="menu-toggle" onClick={() => console.log("Toggle menu")}>☰</button>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Homemade Food, Delivered Fresh</h1>
        <p>Connecting students & job workers with home chefs.</p>
        <button className="cta-button" onClick={() => navigate("/login")}>
  Get Started
</button>

      </header>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step choose-meal">
            <h3>1. Choose Your Meal</h3>
            <p>Browse tiffin services & daily meal options.</p>
          </div>
          <div className="step place-order">
            <h3>2. Place Your Order</h3>
            <p>Order & subscribe for home-cooked meals.</p>
          </div>
          <div className="step">
            <h3>3. Enjoy Homemade Food</h3>
            <p>Get fresh meals delivered to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 LunchBox. All rights reserved.</p>
        <div className="social-icons">
          <a href="#">Facebook</a> | 
          <a href="#">Instagram</a> | 
          <a href="#">Twitter</a>
        </div>
      </footer>
    </>
  );
};

export default Home;
