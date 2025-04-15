// src/components/RoleBasedComponent.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../auth';
import jwtDecode from 'jwt-decode';

const RoleBasedComponent = ({ adminComponent: AdminComponent, vendorComponent: VendorComponent, customerComponent: CustomerComponent }) => {
  const navigate = useNavigate();
  const token = getToken();

  if (!token) {
    navigate('/login');
    return null;
  }

  const user = jwtDecode(token);

  switch (user.role) {
    case 'admin':
      return <AdminComponent />;
    case 'vendor':
      return <VendorComponent />;
    case 'customer':
      return <CustomerComponent />;
    default:
      navigate('/unauthorized');
      return null;
  }
};

export default RoleBasedComponent;
