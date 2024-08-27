import React, { useEffect, useState } from 'react'
import CustomClass from '../../../utils/CustomClass'
import QuickView from '../../QuickView'
import { AppDispatch, RootState } from '../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getApuUrl } from '../../../utils/config'
import { logout } from '../../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

interface BadgeI {
    component: string
    version: string
    numberButton: number
    id: any
}

const Badge: React.FC<BadgeI> = ({ component, version, numberButton, id }) => {
    const profile = useSelector((state: RootState) => state.auth);
    const [productQuickView, setproductQuickView] = useState<Product>({} as Product);

    const [product, setProduct] = useState<Product>();

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {

        if (product) {
            setproductQuickView(product)
        }

    }, [product])


    const handleClothe = () => {
        const url = getApuUrl("/buscarprenda");

        const raw = JSON.stringify({
            id_prenda: id
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: profile.token,
            },
            body: raw
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(({ code, data }) => {

                if (code === 401) {
                    dispatch(logout());
                    navigate('/login');
                }

                if (code !== 200) {
                    return;
                }

                setProduct(data);
                return;
            })
    }


    return (
        <>
            <button onClick={() => handleClothe()} className={`${CustomClass({ component, version, customClass: "galery-image-button-quickview-button" })} ${CustomClass({ component, version, customClass: `galery-image-button-quickview-${numberButton}` })}`} type="button">
                <span className={`${CustomClass({ component, version, customClass: "galery-image-button-quickview-span" })} ${CustomClass({ component, version, customClass: `galery-image-button-quickview-span-${numberButton}` })}`}>{numberButton}</span>
            </button>

            {/* Componente de QuickView */}
            {Object.keys(productQuickView).length > 0 && (
                <QuickView product={productQuickView} setproductQuickView={setproductQuickView} />
            )}

        </>
    )
}

export default Badge