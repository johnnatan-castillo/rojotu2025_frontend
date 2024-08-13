import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomClass from '../../utils/CustomClass';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { addClothingItemThunk, setMessage } from '../../features/cart/cartSlice';

import { getApuUrl } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const component: string = "quickview"
const version: string = "0"

const QuickView: React.FC<QuickViewProps> = ({ product, setproductQuickView }) => {
    const { rol } = useSelector((state: RootState) => state.auth);
    const { nombre_prenda, descripcion, dias } = product;
    const imageRef: any = useRef(null);
    const [imageSrc, setImageSrc] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    const handleMouseMove = (e: any) => {
        if (!isZoomed) return;
        const {
            left,
            top,
            width,
            height
        } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setPosition({ x, y });
    };

    const handleHideQuickView = () => {
        setproductQuickView({} as Product); // Limpia el producto cuando se cierra
    };

    useEffect(() => {
        const loadImage = async () => {
            try {
                const image = await import(`../../assets/plp/${product.ubicacion_archivo}`);
                setImageSrc(image.default);
            } catch (error) {
                const image = await import("../../assets/plp/no-image.jpg");
                setImageSrc(image.default);
                
            }
        };

        loadImage();
    }, [product.ubicacion_archivo]);

    return ReactDOM.createPortal(
        <div className={`${CustomClass({ component, version, customClass: "quickview" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "quickview-container" })}`}>
                {/* Header */}
                <div className={`${CustomClass({ component, version, customClass: "quickview-header" })}`}>
                    <button className={`${CustomClass({ component, version, customClass: "quickview-header-botton-exit" })}`} type="button"
                        onClick={() => handleHideQuickView()}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_12_2)">
                                <mask id="mask0_12_2" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <path d="M24 0H0V24H24V0Z" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_12_2)">
                                    <path d="M6.40008 18.3068L5.69238 17.5991L11.2924 11.9991L5.69238 6.39911L6.40008 5.69141L12.0001 11.2914L17.6001 5.69141L18.3078 6.39911L12.7078 11.9991L18.3078 17.5991L17.6001 18.3068L12.0001 12.7068L6.40008 18.3068Z" fill="#959393" />
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
                {/* Body */}
                <div className={`${CustomClass({ component, version, customClass: "quickview-body" })}`}>

                    {/* Imagen grande */}
                    <div onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove} className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-container" })}`}>
                        <img ref={imageRef} style={{
                            transformOrigin: `${position.x * 100}% ${position.y * 100}%`
                        }} className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-big" })} ${isZoomed && CustomClass({ component, version, customClass: "quickview-body-imagen-big-zoomed" })}`} src={imageSrc} alt={nombre_prenda} />
                    </div>

                    {/* Información de prenda */}
                    <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications" })}`}>
                        <span className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-name" })}`}>{nombre_prenda}</span>
                        <span key={Math.random()} className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-description" })}`}>{descripcion}</span>
                        {
                            rol === "FRONT" &&
                            <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-days-container" })}`}>
                                {dias.split("-").map((day) => (<span className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-days" })}`}>{day}</span>))}
                            </div>
                        }

                        {rol === "BACK" && <QuickViewBackInformation product={product} />}
                        {rol === "FRONT" && <QuickViewFrontInformation product={product} />}
                    </div>

                </div>
                {/* Footer */}
                <div className={`${CustomClass({ component, version, customClass: "quickview-footer" })}`}>

                </div>
            </div>
        </div>
        ,
        document.body
    )
}

interface QuickViewInformationI {
    product: Product;
}

const QuickViewBackInformation = (productSelect: QuickViewInformationI) => {
    const product = productSelect.product
    const { tallas } = product;

    const [selectedSize, setSelectedSize] = useState({
        size: '',
        selectedIntoQuickView: false
    });
    const { prendas_superiores, prendas_inferiores, prendas_otros, token, rol } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items } = useSelector((state: RootState) => state.carts.cart);

    const limits = {
        prendas_superiores: parseInt(prendas_superiores),
        prendas_inferiores: parseInt(prendas_inferiores),
        prendas_otros: parseInt(prendas_otros)
    }

    const handleSizeClick = (size: string) => {
        setSelectedSize({
            size,
            selectedIntoQuickView: selectedSize.size ? selectedSize.selectedIntoQuickView ? true : false : true
        });
    };

    const handleAddCart = () => {
        if (rol) {
            dispatch(addClothingItemThunk({ product, limits, talla: selectedSize.size, token, rol }));
            setSelectedSize((prev) => ({
                ...prev,
                selectedIntoQuickView: false
            }))
        } else {
            navigate("/login");
        }
    }

    return (
        <>
            {tallas && <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes" })} ${CustomClass({ component, version, customClass: "card-footer-product-sizes-block" })}`}>
                {
                    product.tallas.split("-").map((size: string, index: number) => (
                        <button key={index + Math.random()} onClick={() => handleSizeClick(size)}
                            className={`${CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size" })} ${(items.some((item) => item.referencia === product.referencia && size === item.talla) || size === selectedSize.size) && CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size-selected" })}`}
                            type="button"
                        >
                            {size}
                        </button>
                    ))
                }
            </div>}

            <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-container" })} ${CustomClass({ component, version, customClass: "quickview-body-product-buy-container-block" })}`}>
                <button onClick={() => handleAddCart()} className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-button" })}`}>{selectedSize.size ? selectedSize.selectedIntoQuickView ? "Agregar al carrito" : "Actualizar talla" : "Agregar al carrito"}</button>
            </div>
        </>
    )
}

const QuickViewFrontInformation = (productSelect: QuickViewInformationI) => {

    const id_order = uuidv4();
    const { prendas_superiores, prendas_inferiores, prendas_otros, token, rol } = useSelector((state: RootState) => state.auth);
    const { status } = useSelector((state: RootState) => state.carts.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const product: any = productSelect.product;
    const { referencia_prenda_superior, referencia_prenda_inferior, referencia_otro, dias } = product;


    const limits = {
        prendas_superiores: parseInt(prendas_superiores),
        prendas_inferiores: parseInt(prendas_inferiores),
        prendas_otros: parseInt(prendas_otros),
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSize, setSelectedSize] = useState({
        sizes: {
            superior: "",
            inferior: "",
            otro: "",
        },
        selectedIntoQuickView: false,
    });

    const handleSizeClick = (type: string | boolean, size: string, productId: number) => {

        if (!type) {
            return;
        }

        const productIndex = products.findIndex((product) => product.id === productId);
        if (productIndex !== -1) {
            const newProducts = [...products];
            newProducts[productIndex].talla = size;
            setProducts(newProducts);
        }

        setSelectedSize((prev) => ({
            ...prev,
            sizes: {
                superior: type === "superior" ? size : prev.sizes.superior,
                inferior: type === "inferior" ? size : prev.sizes.inferior,
                otro: type === "otro" ? size : prev.sizes.otro,
            },
            selectedIntoQuickView: true
        }));

    };

    const handleAddCart = () => {

        if (rol) {

            let canIPass = false;
            let countClothes = 0;
            const countProducts = products.length;

            const { superior, inferior, otro } = selectedSize.sizes;

            if (superior) {
                countClothes++;
            }

            if (inferior) {
                countClothes++;
            }

            if (otro) {
                countClothes++;
            }

            if (countClothes === 1 && countProducts === 1) {
                canIPass = true;
                dispatch(addClothingItemThunk({ product: products[0], limits, talla: selectedSize.sizes.superior, token, dia: product.dias, rol }));
            }

            if (countClothes === 2 && countProducts === 2) {
                canIPass = true;
                dispatch(addClothingItemThunk({ product: products[0], limits, talla: selectedSize.sizes.superior, token, dia: product.dias, rol }));
                dispatch(addClothingItemThunk({ product: products[1], limits, talla: selectedSize.sizes.inferior, token, dia: product.dias, rol }));
            }

            if (countClothes === 3 && countProducts === 3) {
                canIPass = true;
                dispatch(addClothingItemThunk({ product: products[0], limits, talla: selectedSize.sizes.superior, token, dia: product.dias, rol }));
                dispatch(addClothingItemThunk({ product: products[1], limits, talla: selectedSize.sizes.inferior, token, dia: product.dias, rol }));
                dispatch(addClothingItemThunk({ product: products[2], limits, talla: selectedSize.sizes.otro, token, dia: product.dias, rol }));
            }

            if (!canIPass) {
                dispatch(setMessage({ message: "Debes de seleccionar todas las tallas" }));
            }

        } else {
            navigate("/login");
        }

    };

    const handleFetchSearchClothes = useCallback((id: string, id_order: string) => {
        const url = getApuUrl("/buscarprenda");
        const raw = JSON.stringify({ id_prenda: id });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: raw
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(({ code, data }) => {
                if (code === 200) {
                    setProducts((prevProducts) => {
                        const newProducts = [...prevProducts, { ...data, id_order, dias }];
                        return Array.from(new Set(newProducts.map(product => product.id)))
                            .map(id => newProducts.find(product => product.id === id) as Product);
                    });
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        const references = [
            referencia_prenda_superior,
            referencia_otro,
            referencia_prenda_inferior,
        ];

        if (referencia_prenda_superior || referencia_otro || referencia_prenda_inferior) {
            references.forEach(ref => {
                if (ref != null && ref !== "") {
                    handleFetchSearchClothes(ref, id_order);
                }
            });
        }else{
            handleFetchSearchClothes(product.id, id_order);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleFetchSearchClothes, referencia_prenda_superior, referencia_prenda_inferior, referencia_otro,]);


    return (
        <>
            {
                products.map((product, indexP) => (
                    <div key={product.id + product.referencia} className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes" })} ${CustomClass({ component, version, customClass: "card-footer-product-sizes-front" })}`}>
                        <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes-title-clothe" })}`}>
                            <span className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes-title-clothe-span" })}`}>{product.tipo}</span>
                            <span className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes-title-clothe-span" })}`}>{product.nombre_prenda}</span>
                        </div>
                        <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes-sizes" })}`}>
                            {(product.tallas && product.tallas.length > 0) && product.tallas.split("-").map((size, index) => (
                                <button
                                    key={product.id + index + product.referencia}
                                    onClick={() => handleSizeClick(indexP === 0 ? "superior" : indexP === 1 ? "inferior" : indexP === 2 ? "otro" : "", size, product.id)}
                                    className={`${CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size" })} ${indexP === 0 &&
                                        selectedSize.sizes.superior === size ?
                                        CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size-selected" }) : indexP === 1 &&
                                            selectedSize.sizes.inferior === size ? CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size-selected" }) : indexP === 2 &&
                                                selectedSize.sizes.otro === size ? CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size-selected" }) : ""}`}
                                    type="button"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            }
            <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-container" })} ${status === "enviado" && CustomClass({ component, version, customClass: "quickview-body-product-buy-container-block" })}`}>
                <button onClick={handleAddCart} className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-button" })} ${status === "enviado" && CustomClass({ component, version, customClass: "quickview-body-product-buy-button-block" })}`}>
                    {selectedSize.sizes ? (selectedSize.selectedIntoQuickView ? "Agregar al carrito" : "Actualizar talla") : "Agregar al carrito"}
                </button>
            </div>
        </>
    );
};

export default QuickView;
