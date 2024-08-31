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
                <div className={`${CustomClass({ component, version, customClass: "link-to-gender-container" })}`}>
                    <a className={`${CustomClass({ component, version, customClass: "link-to-gender-a" })}`} href="https://docs.google.com/forms/d/e/1FAIpQLSc1AshdH9cYDxWbeb_SBKqVIWgXSMWB7kaKDxGcXw2MranIPw/viewform" target='_blank' rel='noreferrer'>
                        <div className={`${CustomClass({ component, version, customClass: "link-to-gender" })}`}>
                            <span>¿Te sientes identificado con otra expresión de género?, Dar clic aquí</span>
                        </div>
                    </a>
                </div>
            </main>
        </>
    );
};

export default Layout;
