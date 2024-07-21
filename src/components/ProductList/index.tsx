import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import CustomClass from '../../utils/CustomClass';
import Card from './Card';
import Counter from './Counter';
import { useFetch } from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Link, useLocation } from 'react-router-dom';
import BuyButton from './BuyButton';

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
    const [products, setProducts] = useState<Product[]>([]);
    const location = useLocation();
    const currentPath = location.pathname;
    const isCart = currentPath.includes('/my-clothes');
    const hasFetched = useRef(false);

    const { data, loading, error }: any = useConditionalFetch(isFetch, profile);

    useEffect(() => {
        if (!hasFetched.current && isFetch && !loading && !error && data) {
            setProducts(() => (data));
            hasFetched.current = true;
        }
    }, [data, error, loading, isFetch]);

    useEffect(() => {
        if (productsList) {
            setProducts(productsList);
        }
    }, [productsList]);

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
        return products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [currentPage, itemsPerPage, products]);

    if (displayedProducts.length === 0) {
        return <>
            <div className={`${CustomClass({ component, version, customClass: "product-list-empty" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "product-list-empty-label" })}`}>{isFetch ? "No hay productos disponibles" : "No tienes productos en tu carrito"}</span>
            </div>
            {showArrows && (
                <div className={`${CustomClass({ component, version, customClass: "product-list-pagination" })}`}>
                    {
                        isFetch ?
                            <button className={`${CustomClass({ component, version, customClass: "product-list-pagination-prev" })}`} onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
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
                <div className={`${CustomClass({ component, version, customClass: "product-list-box-counter" })}`}>
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

const useConditionalFetch = (isFetch: boolean, profile: any) => {
    const { data, loading, error } = useFetch("/listarPrendas", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token: profile.token
        },
        body: JSON.stringify({
            "clima": profile.climate,
            "grupo": profile.grupo,
            "rol": profile.rol,
            "genero": profile.gender,
            "pais": profile.pais,
            "identidad": profile.identidad
        })
    });

    return { data, loading, error };
};

export default ProductList;
