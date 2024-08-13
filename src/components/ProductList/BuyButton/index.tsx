import React from 'react'
import CustomClass from '../../../utils/CustomClass';
import { getApuUrl } from '../../../utils/config';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus } from '../../../features/cart/cartSlice';
import Swal from "sweetalert2";

const component: string = "buy-button";
const version: string = "0";


const BuyButton = () => {

    const { token, total, rol } = useSelector((state: RootState) => state.auth);
    const { status, counters } = useSelector((state: RootState) => state.carts.cart);
    const dispatch = useDispatch<AppDispatch>();


    const handleSendOrder = async () => {

        Swal.fire({
            title: "¡Importante!",
            text: `Una vez enviado el pedido, no podra modificarse, ¿Esta de acuerdo?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Continuar",
            confirmButtonColor: "#4D4D4D",
            denyButtonText: `Cancelar`
        }).then((result) => {

            if (result.isConfirmed) {

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
                                return Swal.fire({ title: 'Pedido enviado', text: "Ya se ha enviado tu pedido", icon: 'success', confirmButtonColor: "#E31A2A" });
                            }

                            if (code === 200) {
                                dispatch(setStatus({ status: "enviado" }));
                                return Swal.fire({ title: 'Pedido enviado', text: "Se ha enviado tu pedido", icon: 'success', confirmButtonColor: "#E31A2A" });
                            }

                            if(code !== 200 || code !== 201){
                                return Swal.fire({ title: 'Ha ocurrido un error', text: `Ha ocurrido un error al intentar enviar tu pedido`, icon: 'error', confirmButtonColor: "#E31A2A" });
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

            } else if (result.isDenied) {
                Swal.fire({
                    title: 'Pedido no enviado',
                    text: `Tu pedido no ha sido enviado, puedes seguir navegando`,
                    icon: 'info',
                    confirmButtonColor: "#E31A2A"
                }
                );
            }

        });


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