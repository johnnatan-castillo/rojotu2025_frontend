/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CustomClass from '../../utils/CustomClass';
import { useFetch } from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import NOFOUNDIMAGE from "../../assets/plp/no-image.jpg"
import Badge from '../Galery/SelectClothe';

interface CarruselProps {
    direction: "horizontal" | "vertical";
    slidesPerView: number;
}

const component: string = "slider";
const version: string = "0";

const Slider: React.FC<CarruselProps> = ({ direction, slidesPerView }) => {
    const swiperRef = useRef<any>(null);

    const profile = useSelector((state: RootState) => state.auth);

    const [products, setProducts] = useState<LookBook[]>([]);

    const { data, loading, error } = useFetch("/listarlookbooks", {
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
                // { delay: 1250, disableOnInteraction: false }
                autoplay={false}
                centeredSlides={true}
                loop={true}
                freeMode={true}
                navigation={true}
                modules={swiperModules}
                className={CustomClass({ component, version, customClass: "slider-swiper" })}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className={CustomClass({ component, version, customClass: "slider-swiper-container" })}>
                            <a href="#" className={CustomClass({ component, version, customClass: "slider-swiper-link" })}>
                                <Badge component={component} version={version} numberButton={1} id={product.id_prenda_superior} />
                                <Badge component={component} version={version} numberButton={2} id={product.id_prenda_inferior} />
                                <Badge component={component} version={version} numberButton={3} id={product.id_prenda_otro} />
                                <img
                                    src={product.image && product.image.endsWith('.jpg') ? product.image : NOFOUNDIMAGE}
                                    loading="eager"
                                    alt={product.id + '-' + product.id_prenda_inferior + '-' + product.id_prenda_superior + '-' + product.id_prenda_otro}
                                    className={CustomClass({ component, version, customClass: "slider-swiper-image" })}
                                    crossOrigin="anonymous"
                                />
                            </a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Slider;
