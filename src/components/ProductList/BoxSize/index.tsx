import React from 'react'
import CustomClass from '../../../utils/CustomClass'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { addClothingItemThunk, removeClothingItemThunk } from '../../../features/cart/cartSlice';

interface BoxSizePLPI {
    component: string,
    version: string,
    product: Product
}

export const BoxSizePLP: React.FC<BoxSizePLPI> = ({ component, version, product }) => {
    const { prendas_superiores, prendas_inferiores, prendas_otros, token } = useSelector((state: RootState) => state.auth);
    const { items } = useSelector((state: RootState) => state.carts.cart);
    const dispatch = useDispatch<AppDispatch>();


    const handleAddCart = (size: string) => {

        const limits = {
            prendas_superiores: parseInt(prendas_superiores),
            prendas_inferiores: parseInt(prendas_inferiores),
            prendas_otros: parseInt(prendas_otros)
        }

        dispatch(addClothingItemThunk({ product, limits, talla: size, token }));
    }


    const handleRemoveClotheTOCart = (size: string) => {
        dispatch(removeClothingItemThunk({ productId: product.id , talla: size, token }));
    }


    if (!product.tallas) {
        return <></>;
    }

    return <>
        {
            product.tallas.split("-").map((size: string) => (
                items.some((item) => item.referencia === product.referencia && size === item.talla)
                    ? (
                        <button
                            key={`${product.referencia}-${size}`}
                            onClick={() => handleRemoveClotheTOCart(size)}
                            className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })} ${CustomClass({ component, version, customClass: "card-footer-product-sku-size-selected" })}`}
                            type="button"
                        >
                            {size}
                        </button>
                    )
                    : (
                        <button
                            key={`${product.referencia}-${size}`}
                            onClick={() => handleAddCart(size)}
                            className={`${CustomClass({ component, version, customClass: "card-footer-product-sku-size" })}`}
                            type="button"
                        >
                            {size}
                        </button>
                    )
            ))
        }

    </>
}