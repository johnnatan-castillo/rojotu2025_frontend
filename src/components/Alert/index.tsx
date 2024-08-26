import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import CustomClass from '../../utils/CustomClass';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const component: string = "alert"
const version: string = "0"

const Alert = () => {

    const { messageId, message } = useSelector((state: RootState) => state.carts.cart);
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false)
    }


    useEffect(() => {

        if (message && message.length > 0 && message !== undefined && message !== null && message !== "El carrito se ha limpiado") {

            setShow(true);

            const timer = setTimeout(() => {
                setShow(false);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [message, messageId])

    return <>
        {
            show && ReactDOM.createPortal(
                <div className={`${CustomClass({ component, version, customClass: "alert" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "alert-container" })}`}>
                        <div className={`${CustomClass({ component, version, customClass: "alert-box-1" })}`}>
                            <span className={`${CustomClass({ component, version, customClass: "alert-text" })}`}>{message}</span>
                        </div>
                        <div className={`${CustomClass({ component, version, customClass: "alert-box-2" })}`}>
                            <button onClick={() => handleClose()} className={`${CustomClass({ component, version, customClass: "alert-exit" })}`} type="button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_12_2)">
                                        <mask id="mask0_12_2" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                            <path d="M24 0H0V24H24V0Z" fill="white" />
                                        </mask>
                                        <g mask="url(#mask0_12_2)">
                                            <path d="M6.40008 18.3068L5.69238 17.5991L11.2924 11.9991L5.69238 6.39911L6.40008 5.69141L12.0001 11.2914L17.6001 5.69141L18.3078 6.39911L12.7078 11.9991L18.3078 17.5991L17.6001 18.3068L12.0001 12.7068L6.40008 18.3068Z" />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_12_2">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                , document.body
            )
        }
    </>
}

export default Alert