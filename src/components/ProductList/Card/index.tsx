import React, { useEffect, useState } from 'react'
import CustomClass from '../../../utils/CustomClass';
import QuickView from '../../QuickView';
import { BoxSizePLP } from '../BoxSize';
import { removeClothingItemThunk } from '../../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';

const component: string = "card"
const version: string = "0"

const Card: React.FC<CardProps> = ({ product, showSizes, showQuickView, index, isPLP }) => {
    const { token, rol } = useSelector((state: RootState) => state.auth);
    const { items, status } = useSelector((state: RootState) => state.carts.cart);
    const [imageSrc, setImageSrc] = useState("");
    const [productQuickView, setproductQuickView] = useState<Product>({} as Product);
    const dispatch = useDispatch<AppDispatch>();

    const handleRemoveClotheTOCart = async (reference: string) => {
        for (const item of items) {
            if (rol === "BACK") {
                if (item.referencia === reference) {
                    await dispatch(removeClothingItemThunk({ productId: item.id, talla: item.talla, token, rol })).unwrap();
                }
            } else {
                if (item.referencia === reference) {

                    if (rol) {
                        const filterTODelete = items.filter((product) => product.id_order === item.id_order);

                        for (const filter of filterTODelete) {
                            await dispatch(removeClothingItemThunk({ productId: filter.id, talla: filter.talla, token, rol })).unwrap();
                        }
                    }

                }
            }
        }
    };
    // product.ubicacion_archivo && product.ubicacion_archivo.endsWith('.jpg') ? product.ubicacion_archivo : NOFOUNDIMAGE

    useEffect(() => {
        const loadImage = async () => {
            try {
                const image = await import(`../../../assets/plp/${product.ubicacion_archivo}`);
                setImageSrc(image.default);
            } catch (error) {
                const image = await import("../../../assets/plp/no-image.jpg");
                setImageSrc(image.default);
                
            }
        };

        loadImage();
    }, [product.ubicacion_archivo]);


    return (
        <div
            key={`${product.id}-${index}`}
            className={`${CustomClass({ component, version, customClass: "card" })} ${CustomClass({ component, version, customClass: `card-${index}` })}`}
        >
            {/* Header */}
            <div className={`${CustomClass({ component, version, customClass: "card-header" })}`}>
                {
                    !isPLP && status !== "enviado" && <div className={`${CustomClass({ component, version, customClass: "card-header-remove-item" })}`}>
                        <button onClick={() => handleRemoveClotheTOCart(product.referencia)} className={`${CustomClass({ component, version, customClass: "card-header-remove-item-button" })}`} type="button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.25C6.62391 2.25 2.25 6.62391 2.25 12C2.25 17.3761 6.62391 21.75 12 21.75C17.3761 21.75 21.75 17.3761 21.75 12C21.75 6.62391 17.3761 2.25 12 2.25ZM15.75 12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H15.75C15.9489 11.25 16.1397 11.329 16.2803 11.4697C16.421 11.6103 16.5 11.8011 16.5 12C16.5 12.1989 16.421 12.3897 16.2803 12.5303C16.1397 12.671 15.9489 12.75 15.75 12.75Z" />
                            </svg>
                        </button>
                    </div>
                }
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
                <img className={`${CustomClass({ component, version, customClass: "card-body-image" })}`} src={imageSrc} alt={product.nombre_archivo} />
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
                    <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes" })} ${status ==="enviado" && CustomClass({ component, version, customClass: "card-footer-product-sizes-block" })}`}>
                        <BoxSizePLP component={component} version={version} product={product} isPLP={isPLP} />
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
