import React, { useState } from 'react'
import CustomClass from '../../../utils/CustomClass';
import QuickView from '../../QuickView';
import { BoxSizePLP } from '../BoxSize';
import NOFOUNDIMAGE from "../../../assets/plp/no-image.jpg"

const component: string = "card"
const version: string = "0"

const Card: React.FC<CardProps> = ({ product, showSizes, showQuickView, index }) => {

    const [productQuickView, setproductQuickView] = useState<Product>({} as Product);

    return (
        <div
            key={`${product.id}-${index}`}
            className={`${CustomClass({ component, version, customClass: "card" })} ${CustomClass({ component, version, customClass: `card-${index}` })}`}
        >
            {/* Header */}
            <div className={`${CustomClass({ component, version, customClass: "card-header" })}`}>
            </div>

            {/* Body */}
            <div className={`${CustomClass({ component, version, customClass: "card-body" })}`}>
                {showQuickView && (
                    <div className={`${CustomClass({ component, version, customClass: "card-body-button-overlay" })}`}>
                        <button
                            className={`${CustomClass({ component, version, customClass: "card-body-button-quickview" })}`}
                            onClick={() => setproductQuickView(product)}
                        >
                            <span className={`${CustomClass({ component, version, customClass: "card-body-button-quickview-text" })}`}>Quick View</span>
                        </button>
                    </div>
                )}
                <img className={`${CustomClass({ component, version, customClass: "card-body-image" })}`} src={product.ubicacion_archivo && product.ubicacion_archivo.endsWith('.jpg') ? product.ubicacion_archivo : NOFOUNDIMAGE} alt={product.nombre_archivo} />
            </div>

            {/* Footer */}
            <div className={`${CustomClass({ component, version, customClass: "card-footer" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "card-footer-product-sku" })}`}>{product.tipo}</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "card-footer-container-name" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "card-footer-product-name" })}`}>{product.nombre_prenda}</span>
                </div>
                {showSizes && product.tallas && (
                    <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes" })}`}>
                        <BoxSizePLP component={component} version={version} product={product} />
                    </div>
                )}
            </div>

            {/* Componente de QuickView */}
            {showQuickView && Object.keys(productQuickView).length > 0 && (
                <QuickView product={productQuickView} setproductQuickView={setproductQuickView} />
            )}
        </div>
    )
}

export default Card;
