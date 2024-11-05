import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
  const role = localStorage.getItem('role');

  // Check if user's role is allowed
  return roles.includes(role) ? children : <Navigate to="/notfound" />;
};

export default PrivateRoute;