import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Vendors from './pages/Vendors';
import Login from './pages/Login';
import Register from './pages/Register';

import CustomerDashboard from './pages/CustomerDashboard';
import VendorDashboard from "./pages/VendorDashboard"; // ✅ correct path

import PrivateRouteVendor from './components/PrivateRouteVendor';
import PrivateRouteCustomer from './components/PrivateRouteCustomer';
import DashboardRedirect from './components/DashboardRedirect'; // ✅ New import


const App = () => {
  // Redirect logic for /dashboard based on user role
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />

        
        {/* Dashboard role-based redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} /> {/* ✅ Use this now */}


        {/* Smart Redirect Route */}
        <Route
          path="/dashboard"
          element={
            user?.role === 'vendor' ? (
              <Navigate to="/vendor/dashboard" />
            ) : user?.role === 'customer' ? (
              <Navigate to="/customer/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Protected Vendor Dashboard */}
        <Route
          path="/vendor/dashboard"
          element={
            <PrivateRouteVendor>
              <VendorDashboard />
            </PrivateRouteVendor>
          }
        />

        {/* Protected Customer Dashboard */}
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRouteCustomer>
              <CustomerDashboard />
            </PrivateRouteCustomer>
          }
        />
        
        <Route
  path="/dashboard"
  element={<DashboardRedirect />}
/>

      </Routes>
    </Router>
  );
};

export default App;
