import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const PrivateRoute: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);  

  return token?.length !== 4 ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
