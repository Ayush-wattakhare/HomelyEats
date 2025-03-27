import React from "react";

function Home() {
  return (
    <div>
      <h1>Welcome to HomeBite</h1>
      <p>Your home-cooked meal delivery service.</p>
      <nav>
        <ul>
          <li><a href="/menu">View Menu</a></li>
          <li><a href="/order">Track Orders</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
