import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import CustomClass from '../../utils/CustomClass';
import Alert from '../Alert';

const component: string = "layout"
const version: string = "0"

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            <main className={`${CustomClass({ component, version, customClass: "layout" })}`}>
                <Outlet />
                <Alert />
            </main>
        </>
    );
};

export default Layout;
