import React from 'react'
import CustomClass from '../../../utils/CustomClass';
import { getApuUrl } from '../../../utils/config';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setStatus } from '../../../features/cart/cartSlice';

const component: string = "buy-button";
const version: string = "0";


const BuyButton = () => {

    const { token } = useSelector((state: RootState) => state.auth);
    const { status } = useSelector((state: RootState) => state.carts.cart);
    const dispatch = useDispatch<AppDispatch>();


    const handleSendOrder = () => {
        const url = getApuUrl("/enviarCarrito");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token
            }
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(({ code }) => {

                if (code === 201) {
                    dispatch(setMessage({ message: "Ya se ha enviado tu pedido" }));
                }

                if (code === 200) {
                    dispatch(setMessage({ message: "Se ha enviado tu pedido" }));
                    dispatch(setStatus({ status: "enviado" }));
                }

            })
    }

    return (
        <div className={`${CustomClass({ component, version, customClass: "buy-button" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "buy-button-container" })}`} >
                <button onClick={() => handleSendOrder()} className={`${CustomClass({ component, version, customClass: "buy-button-button" })} ${status === "enviado" && CustomClass({ component, version, customClass: "buy-button-button-block" })}`} type="button">Enviar pedido</button>
            </div>
        </div>
    )
}

export default BuyButton