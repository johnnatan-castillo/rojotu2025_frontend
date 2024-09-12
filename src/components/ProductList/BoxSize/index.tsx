import React, { useState } from 'react'
import CustomClass from '../../../utils/CustomClass'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { addClothingItemThunk, removeClothingItemThunk } from '../../../features/cart/cartSlice';
import QuickView from '../../QuickView';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../../utils/Decrypt';

interface BoxSizePLPI {
    component: string,
    version: string,
    product: Product
    isPLP: boolean;
}

export const BoxSizePLP: React.FC<BoxSizePLPI> = ({ component, version, product, isPLP }) => {
    let { rol }: any = useSelector((state: RootState) => state.auth);
    rol = decryptData(rol).data

    if (!product.tallas) {
        return <></>;
    }

    return <>
        {
            rol === "FRONT" && <BoxSizePLPFront component={component} version={version} product={product} isPLP={isPLP} />

        }
        {
            rol === "BACK" && <BoxSizePLPBack component={component} version={version} product={product} isPLP={isPLP} />

        }

    </>
}

const BoxSizePLPBack: React.FC<BoxSizePLPI> = ({ component, version, product, isPLP }) => {

    let { prendas_superiores, prendas_inferiores, prendas_otros, token, rol }: any = useSelector((state: RootState) => state.auth);
    rol = decryptData(rol).data
    const { items } = useSelector((state: RootState) => state.carts.cart);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const handleAddCart = (size: string) => {

        const limits = {
            prendas_superiores: parseInt(prendas_superiores),
            prendas_inferiores: parseInt(prendas_inferiores),
            prendas_otros: parseInt(prendas_otros)
        }

        if (rol) {
            dispatch(addClothingItemThunk({ product, limits, talla: size, token, rol }));
        } else {
            navigate("/login");
        }


    }


    const handleRemoveClotheTOCart = (size: string) => {
        if (rol) {
            dispatch(removeClothingItemThunk({ productId: product.id, talla: size, token, rol }));
        } else {
            navigate("/login");
        }
    }


    return (
        <>
            <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size-box" })}`}>
                {
                    product.tallas.split("-").map((size: string) => {
                        const itemInCart = items.find(item => item.referencia === product.referencia && item.talla === size);

                        return itemInCart ? (
                            <button
                                key={`${product.referencia}-${size}`}
                                onClick={() => handleRemoveClotheTOCart(size)}
                                className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })} ${CustomClass({ component, version, customClass: "card-footer-product-sku-size-selected" })}`}
                                type="button"
                            >
                                {size}
                            </button>
                        ) : (
                            <button
                                key={`${product.referencia}-${size}`}
                                onClick={() => handleAddCart(size)}
                                className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })}`}
                                type="button"
                            >
                                {size}
                            </button>
                        );
                    })
                }

            </div>
        </>
    )
}

const BoxSizePLPFront: React.FC<BoxSizePLPI> = ({ component, version, product, isPLP }) => {

    const [showQuickView, setshowQuickView] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const isCart = currentPath.includes('/my-clothes');

    const [productQuickView, setproductQuickView] = useState<Product>({} as Product);

    return (
        <>
            <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-days-box" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-days-box-title" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-days-title-span" })}`}>Dias de uso</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-days-body" })} ${isCart && CustomClass({ component, version, customClass: "card-footer-product-sku-days-body-my-cart" })}`}>
                    {
                        product.dias.split("-").map((day: string) => (
                            <button
                                key={`${product.referencia}-${day}`}
                                className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })} ${CustomClass({ component, version, customClass: "card-footer-product-sku-day" })}`}
                                type="button"
                            >
                                {day}
                            </button>
                        ))
                    }
                </div>
                <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-days-body" })} ${isCart && CustomClass({ component, version, customClass: "card-footer-product-sku-days-body-my-cart" })}`}>
                    {
                        isCart &&
                        <div className={`${CustomClass({ component, version, customClass: "card-footer-body-product-buy-size-1" })}`}>
                            <span className={`${CustomClass({ component, version, customClass: "card-footer-body-product-buy-size-text" })}`}>Talla seleccionada</span>
                        </div>
                    }
                    <div className={`${CustomClass({ component, version, customClass: "card-footer-body-product-buy-size-2" })}`}>
                        {
                            !isCart &&

                            <div className={`${CustomClass({ component, version, customClass: "card-footer-body-product-buy-container" })}`}>
                                <button onClick={() => { setproductQuickView(product); setshowQuickView(true); }} className={`${CustomClass({ component, version, customClass: "card-footer-body-product-buy-button" })}`}>Seleccionar tallas</button>
                            </div>
                        }

                        {
                            isCart &&

                            <button
                                key={`${product.referencia}`}
                                className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })}`}
                                type="button"
                            >
                                {product.talla}
                            </button>
                        }
                    </div>

                </div>
            </div>
            {showQuickView && Object.keys(productQuickView).length > 0 && (
                <QuickView products={productQuickView} setproductQuickView={setproductQuickView} />
            )}
        </>
    )
}