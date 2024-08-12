import React from 'react'
import CustomClass from '../../../utils/CustomClass';
import { getApuUrl } from '../../../utils/config';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setStatus } from '../../../features/cart/cartSlice';
import Swal from "sweetalert2";

const component: string = "buy-button";
const version: string = "0";


const BuyButton = () => {

    const { token, total, rol } = useSelector((state: RootState) => state.auth);
    const { status, counters } = useSelector((state: RootState) => state.carts.cart);
    const dispatch = useDispatch<AppDispatch>();


    const handleSendOrder = () => {

        const handleFetch = () => {
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

        if (rol === "BACK" && parseInt(total) === (counters.back.lower + counters.back.upper + counters.back.other)) {
            handleFetch();
        } else if (rol === "FRONT" && parseInt(total) === (counters.front.LUNES + counters.front.MARTES + counters.front.MIERCOLES + counters.front.JUEVES + counters.front.VIERNES)) {
            handleFetch();
        } else {
            return Swal.fire({ title: 'Completa tu pedido', text: `El pedido no esta completo, revisa que todas tus prendas esten completas `, icon: 'error', confirmButtonColor: "#E31A2A" });
        }
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