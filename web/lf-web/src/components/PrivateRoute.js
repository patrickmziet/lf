/* // PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ path, element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Route path={path} element={element} /> 
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute; */

// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route {...rest} element={isAuthenticated ? element : <Navigate to="/login" replace />} />
  );
};

export default PrivateRoute;