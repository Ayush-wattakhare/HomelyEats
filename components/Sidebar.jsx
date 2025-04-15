// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Optional styling

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>LunchBox</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {role === "vendor" && <li><Link to="/dashboard/orders">Orders</Link></li>}
        {role === "customer" && <li><Link to="/dashboard/menu">Browse Menu</Link></li>}
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
