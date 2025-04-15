import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteCustomer = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role === 'customer') {
      setAuthorized(true);
    }
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return authorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRouteCustomer;
