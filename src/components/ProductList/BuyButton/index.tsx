import React from 'react'
import CustomClass from '../../../utils/CustomClass';

const component: string = "buy-button";
const version: string = "0";


const BuyButton = () => {

    const handleSendOrder = () => {
        alert("Orden a enviar")
    }

    return (
        <div className={`${CustomClass({ component, version, customClass: "buy-button" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "buy-button-container" })}`} >
                <button onClick={() => handleSendOrder()} className={`${CustomClass({ component, version, customClass: "buy-button-button" })}`} type="button">Enviar pedido</button>
            </div>
        </div>
    )
}

export default BuyButton