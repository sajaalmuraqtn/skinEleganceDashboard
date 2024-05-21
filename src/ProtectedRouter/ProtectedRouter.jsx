import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRouter({ children }) { // Add curly braces around children
  if (localStorage.getItem('adminToken')) {
    return <>{children}</>; // Render children using fragment
  } else {
    return <Navigate to='/login' />; // Corrected closing tag for Navigate component
  }
}
