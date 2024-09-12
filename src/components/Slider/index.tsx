/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CustomClass from '../../utils/CustomClass';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

import Badge from '../Galery/SelectClothe';
import QuickView from '../QuickView';
import { getApuUrl } from '../../utils/config';
import { logout, updateTokenUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../../utils/Decrypt';

interface CarruselProps {
    direction: "horizontal" | "vertical";
    slidesPerView: number;
}

const component: string = "slider";
const version: string = "0";

const Slider: React.FC<CarruselProps> = ({ direction, slidesPerView }) => {
    const swiperRef = useRef<any>(null);

    const profile = useSelector((state: RootState) => state.auth);
    const rol = decryptData(profile.rol).data

    const [products, setProducts] = useState<LookBook[]>([]);

    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const fetchClothes = () => {

        const url = getApuUrl("/listarPrendas");

        const raw = JSON.stringify({
            "tipo": "LOOKBOOK"
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

                if (result.code === 401) {
                    dispatch(logout());
                    navigate('/login');
                }

                if (result.code === 200) {
                    setData(result.data);
                    dispatch(updateTokenUser({ token: result.token }))
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
        if (!loading && !error && data) {
            setProducts(() => (data));
        }
    }, [data, error, loading]);

    const swiperModules = useMemo(() => [Pagination, Navigation, FreeMode, Autoplay], []);

    const onInit = useCallback((swiper: any) => {
        swiperRef.current = swiper;
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.stop();
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (swiperRef.current && swiperRef.current.autoplay) {
            swiperRef.current.autoplay.start();
        }
    }, []);

    return (
        <div
            className={CustomClass({ component, version, customClass: "slider" })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Swiper
                onInit={onInit}
                direction={direction}
                slidesPerView={slidesPerView}
                spaceBetween={10}
                pagination={{ clickable: true }}
                autoplay={{ delay: 1250, disableOnInteraction: false }}
                centeredSlides={false}
                loop={true}
                freeMode={true}
                navigation={true}
                modules={swiperModules}
                className={CustomClass({ component, version, customClass: "slider-swiper" })}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className={CustomClass({ component, version, customClass: "slider-swiper-container" })}>
                            {
                                rol === "BACK" && <SliderSwiperBack product={product} />
                            }
                            {
                                rol === "FRONT" && <SliderSwiperFront product={product} />
                            }
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


const SliderSwiperBack = ({ product }: { product: LookBook }) => {

    const [imageSrc, setImageSrc] = useState("");

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

    return <>
        <a href="#" className={`${CustomClass({ component, version, customClass: "slider-swiper-link" })} ${CustomClass({ component, version, customClass: "slider-swiper-link-back" })}`}>
            {product.referencia_otro && <Badge component={component} version={version} numberButton={1} id={product.referencia_otro} />}
            {product.referencia_prenda_superior && <Badge component={component} version={version} numberButton={2} id={product.referencia_prenda_superior} />}
            {product.referencia_prenda_inferior && <Badge component={component} version={version} numberButton={3} id={product.referencia_prenda_inferior} />}
            <img
                src={imageSrc}
                loading="eager"
                alt={product.id + '-' + product.referencia_prenda_superior + '-' + product.referencia_prenda_inferior + '-' + product.referencia_otro}
                className={CustomClass({ component, version, customClass: "slider-swiper-image" })}
                crossOrigin="anonymous"
            />
        </a>
    </>
}

const SliderSwiperFront = ({ product }: { product: any }) => {

    const [showQuickView, setshowQuickView] = useState(false);

    const [productQuickView, setproductQuickView] = useState<Product>({} as Product);

    const [imageSrc, setImageSrc] = useState("");

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

    return <>
        <button onClick={() => { setproductQuickView({ ...product, referencia_prenda_superior: product.referencia_prenda_superior, id_prenda_inferior: product.id_prenda_inferior, id_prenda_otro: product.id_prenda_otro }); setshowQuickView(true); }} className={`${CustomClass({ component, version, customClass: "slider-swiper-link" })} ${CustomClass({ component, version, customClass: "slider-swiper-link-front" })}`} type="button">
            <img
                src={imageSrc}
                loading="eager"
                alt={product.id + '-' + product.referencia_prenda_superior + '-' + product.referencia_prenda_inferior + '-' + product.referencia_otro}
                className={CustomClass({ component, version, customClass: "slider-swiper-image" })}
                crossOrigin="anonymous"
            />
        </button>
        {showQuickView && Object.keys(productQuickView).length > 0 && (
            <QuickView products={productQuickView} setproductQuickView={setproductQuickView} />
        )}
    </>
}


export default Slider;
