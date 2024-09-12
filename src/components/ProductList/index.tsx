import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import CustomClass from '../../utils/CustomClass';
import Card from './Card';
import Counter from './Counter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BuyButton from './BuyButton';
import { filter as filters, resetFilter } from '../../features/filter/filterSlice';
import { getApuUrl } from '../../utils/config';
import { logout, updateTokenUser } from '../../features/auth/authSlice';
import { decryptData } from '../../utils/Decrypt';

const component: string = "product-list";
const version: string = "0";

interface ProductListProps {
    itemsPerPage: number;
    showArrows: boolean;
    showQuickView: boolean;
    showSizes: boolean;
    userRole: string;
    isFetch: boolean
    productsList?: Product[]
    isPLP: boolean
}

const ProductList: React.FC<ProductListProps> = ({ itemsPerPage, showArrows, showQuickView, showSizes, isFetch, productsList, isPLP }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const profile = useSelector((state: RootState) => state.auth);
    const filter = useSelector((state: RootState) => state.filter.isFilteredBy);
    const dispatch = useDispatch<AppDispatch>();
    const [products, setProducts] = useState<Product[]>([]);
    const location = useLocation();
    const currentPath = location.pathname;
    const isCart = currentPath.includes('/my-clothes');
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);

    const rol = decryptData(profile.rol).data


    const fetchClothes = () => {

        const url = getApuUrl("/listarPrendas");

        const raw = JSON.stringify({
            "tipo": rol === "BACK" ? "PRENDA" : 'OUTFIT'
        });

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                token: profile.token
            },
            body: raw,
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 200) {
                    setData(result.data);
                    dispatch(updateTokenUser({ token: result.token }))
                }

                if (result.code === 401) {
                    dispatch(logout());
                    navigate('/login');
                }

            })
            .catch((error) => {
                console.error(error);
                setError(true);
                dispatch(logout());
                navigate('/login');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {

        if (!hasFetched.current) {
            setLoading(true);
            fetchClothes();
            hasFetched.current = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (hasFetched.current && isFetch && !loading && !error && data) {
            setProducts(() => (data));
        }
    }, [data, error, loading, isFetch]);

    useEffect(() => {
        if (productsList) {
            setProducts(productsList);
        }
    }, [productsList]);

    useEffect(() => {
    
        if(rol === "BACK"){
            if(!isCart){
                dispatch(filters({ isFilteredBy: "SUPERIOR" }))
            }else{
                dispatch(resetFilter())
            }
        }

        if(rol === "FRONT"){
            if(!isCart){
                dispatch(filters({ isFilteredBy: "LUNES" }))
            }else{
                dispatch(resetFilter())
            }
        }
    
    }, [dispatch, isCart, location, rol])
    

    const totalPages = useMemo(() => {
        return Math.ceil(products.length / itemsPerPage);
    }, [products.length, itemsPerPage]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    }, [totalPages]);

    const displayedProducts = useMemo(() => {

        if (filter !== undefined && filter !== "") {

            if (rol === "BACK") {
                return products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .filter(product => filter.split('/').includes(product?.segmento_Prenda));

            } else if (rol === "FRONT") {
                return products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).filter(product => product.dias.split("-").includes(filter));
            } else {
                navigate("/login")
            }

        }

        return products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filter, isCart, itemsPerPage, products]);

    if (displayedProducts.length === 0) {
        return <>
            <div className={`${CustomClass({ component, version, customClass: "product-list-empty" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "product-list-empty-label" })}`}>{isFetch ? "No hay productos disponibles" : "No tienes productos en tu carrito"}</span>

                {filter && !isCart && <button className={`${CustomClass({ component, version, customClass: "product-list-empty-remove-filters" })}`} type="button" onClick={() => {
                    dispatch(resetFilter())
                }}>Quitar filtros</button>}

            </div>
            {showArrows && (
                <div className={`${CustomClass({ component, version, customClass: "product-list-pagination" })}`}>
                    {
                        isFetch ?
                            currentPage >= 1 && totalPages >= 1 ? <></> : <button className={`${CustomClass({ component, version, customClass: "product-list-pagination-prev" })}`} onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
                            :
                            <Link className={`${CustomClass({ component, version, customClass: "product-list-pagination-prev" })} ${CustomClass({ component, version, customClass: "nav-link-1" })}`} to="/clothes">
                                Ir aprendas
                            </Link>
                    }
                </div>
            )}
        </>
    }

    return (
        <div className={`${CustomClass({ component, version, customClass: "product-list" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "product-list-counter" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "product-list-box-counter" })} ${isCart && CustomClass({ component, version, customClass: "product-list-box-counter-block" })}`}>
                    <Counter />
                    {isCart && <BuyButton />}
                </div>
            </div>
            <div className={`${CustomClass({ component, version, customClass: "product-list-container" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "product-list-container-products" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "product-list-box" })}`}>
                        {displayedProducts.map((product, index) => (
                            <Card key={index} product={product} showSizes={showSizes} showQuickView={showQuickView} index={index} isPLP={isPLP} />
                        ))}
                    </div>
                    {showArrows && (
                        <div className={`${CustomClass({ component, version, customClass: "product-list-pagination" })}`}>
                            {currentPage !== 1 && <button className={`${CustomClass({ component, version, customClass: "product-list-pagination-prev" })}`} onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>}
                            {totalPages > 1 && currentPage !== totalPages && <button className={`${CustomClass({ component, version, customClass: "product-list-pagination-next" })}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
