import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const PublicRoute: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    return token && token?.length === 0 ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;
