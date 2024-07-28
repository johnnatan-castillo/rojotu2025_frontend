import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { login } from '../../features/auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { getApuUrl } from '../../utils/config';

import BANERLOGIN from "../../assets/baner-rojo-tu-login.jpg"
import LOGO from "../../assets/logo-rojo-tu-login.png"

import { Link } from 'react-router-dom';
import CustomClass from '../../utils/CustomClass';
import { encryptData } from '../../utils/Decrypt';
import { addClothingItem } from '../../features/cart/cartSlice';

const component: string = "login"
const version: string = "0"

const Login: React.FC = () => {
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
        rememberMe: false,
        error: {
            isError: false,
            message: ''
        },
        loading: false
    });

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (loginForm.email.length <= 0 && loginForm.password.length <= 0) {
            setLoginForm((prev) => ({
                ...prev,
                error: {
                    isError: true,
                    message: "Debes ingresar tus datos"
                }
            }))
            return;
        }

        setLoginForm((prev) => ({
            ...prev,
            loading: true
        }))

        const url = getApuUrl("/authUser");


        const raw = JSON.stringify({
            "usuario": encryptData(loginForm.email).data,
            "password": encryptData(loginForm.password).data
        });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: raw
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(({ code, data }) => {

                if (code !== 200) {
                    setLoginForm((prev) => ({
                        ...prev,
                        error: {
                            isError: true,
                            message: "Contraseña o Usuario incorrectos"
                        },
                        loading: false
                    }))
                    return;
                }

                const user = data?.user
                const nombre = data?.nombre
                const token = data?.token;
                const rol = data?.rol;
                const gender = data?.genero;
                const climate = data?.clima;
                const grupo = data?.grupo;
                const pais = data?.pais;
                const identidad = data?.identidad;
                const prendas_superiores = data?.prendas_superiores;
                const prendas_inferiores = data?.prendas_inferiores;
                const prendas_otros = data?.prendas_otros;
                const total = data?.total
                const correo = data?.correo
                const url_3d = data?.url_3d
                const primer_ingreso = data?.primer_ingreso
                const administrador = data?.administrador;

                const combineReducers: any = {
                    user,
                    nombre,
                    token,
                    rol,
                    gender,
                    climate,
                    grupo,
                    pais,
                    identidad,
                    prendas_superiores,
                    prendas_inferiores,
                    prendas_otros,
                    total,
                    correo,
                    url_3d,
                    primer_ingreso,
                    administrador,
                }


                handleRecoverCart({ prendas_superiores, prendas_inferiores, prendas_otros }, token, rol).then(() => {
                    dispatch(login(combineReducers));
                    navigate('/');
                })
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoginForm((prev) => ({
                    ...prev,
                    error: {
                        isError: true,
                        message: "Hubo un error al intentar iniciar sesión"
                    },
                    loading: false
                }))
                return;
            });
    };

    const handleRecoverCart = async (limits: { prendas_superiores: number; prendas_inferiores: number; prendas_otros: number; }, token: string, rol: string) => {
        const url = getApuUrl("/buscarCarrito");

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token
            }
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(({ code, data }) => {

                if (code !== 200) {
                    console.log("Error al intentar obtener el carrito");
                    return;
                }

                if (data.length > 0) {

                    const cartOrderId = {
                        LUNES: uuidv4(),
                        MARTES: uuidv4(),
                        MIERCOLES: uuidv4(),
                        JUEVES: uuidv4(),
                        VIERNES: uuidv4(),
                        SABADO: uuidv4(),
                    }

                    data.map((product: Product) => {

                        if (rol === "BACK") {
                            return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                        } else if (rol === "FRONT") {

                            if (product.dia === "LUNES") {
                                product.prenda.id_order = cartOrderId[product.dia];
                                product.prenda.dias = product.dia;

                                return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                            }

                            if (product.dia === "MARTES") {
                                product.prenda.id_order = cartOrderId[product.dia];
                                product.prenda.dias = product.dia;

                                return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                            }

                            if (product.dia === "MIERCOLES") {
                                product.prenda.id_order = cartOrderId[product.dia];
                                product.prenda.dias = product.dia;

                                return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                            }

                            if (product.dia === "JUEVES") {
                                product.prenda.id_order = cartOrderId[product.dia];
                                product.prenda.dias = product.dia;

                                return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                            }

                            if (product.dia === "VIERNES") {
                                product.prenda.id_order = cartOrderId[product.dia];
                                product.prenda.dias = product.dia;

                                return dispatch(addClothingItem({ product, talla: product.talla, limits, id: data.carrito_id, rol }))
                            }

                        } else {
                            return navigate('/login');
                        }

                        return null;

                    })
                }

            })
    }

    return (
        <div className={`${CustomClass({ component, version, customClass: "login" })}`}>
            <img className={`${CustomClass({ component, version, customClass: "login-logo" })}`} src={LOGO} alt="Logo Rojo tú" />
            <img className={`${CustomClass({ component, version, customClass: "login-baner" })}`} src={BANERLOGIN} alt="Baner login rojo tú" />
            <form onSubmit={handleSubmit} className={`${CustomClass({ component, version, customClass: "login-container-form" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "login-title-span" })}`}>Iniciar Sesión</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-2" })}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5925 3.02719C14.6803 2.04234 13.4063 1.5 12 1.5C10.5863 1.5 9.30799 2.03906 8.40002 3.01781C7.48221 4.00734 7.03502 5.35219 7.14002 6.80437C7.34815 9.66937 9.52831 12 12 12C14.4717 12 16.6481 9.66984 16.8596 6.80531C16.966 5.36625 16.516 4.02422 15.5925 3.02719ZM20.25 22.5H3.75002C3.53405 22.5028 3.32017 22.4574 3.12394 22.3672C2.92772 22.2769 2.75407 22.1441 2.61565 21.9783C2.31096 21.6141 2.18815 21.1167 2.27909 20.6137C2.67471 18.4191 3.9094 16.5755 5.85002 15.2812C7.57409 14.1323 9.75799 13.5 12 13.5C14.2421 13.5 16.426 14.1328 18.15 15.2812C20.0906 16.575 21.3253 18.4186 21.721 20.6133C21.8119 21.1162 21.6891 21.6136 21.3844 21.9778C21.246 22.1437 21.0724 22.2766 20.8762 22.367C20.6799 22.4573 20.466 22.5028 20.25 22.5Z" fill="#EF0F0F" />
                    </svg>
                    <input className={`${CustomClass({ component, version, customClass: "login-form-child-input" })} ${CustomClass({ component, version, customClass: "login-form-child-email" })}`} placeholder='Correo Institucional' type="text" value={loginForm.email} onChange={(e) => setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                        error: {
                            isError: false,
                            message: ''
                        }
                    }))} required />
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-3" })}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_76_2)">
                            <path d="M21.4816 20.445C21.4816 22.4 19.8816 24 17.9266 24H6.07498C4.11831 24 2.51831 22.4 2.51831 20.445V10.37C2.51831 8.415 4.11831 6.815 6.07498 6.815H17.9266C19.8816 6.815 21.4816 8.415 21.4816 10.37V20.445Z" fill="#E31A2A" />
                            <path d="M12 11.8517C9.22331 11.8517 6.96331 9.59166 6.96331 6.815C6.96331 4.03666 9.22331 1.77833 12 1.77833C14.78 1.77833 17.0366 4.03666 17.0366 6.815C17.0366 9.59166 14.78 11.8517 12 11.8517ZM12 0.00166321C8.23665 0.00166321 5.18665 3.05333 5.18665 6.815C5.18665 10.5783 8.23665 13.6283 12 13.6283C15.7633 13.6283 18.815 10.5783 18.815 6.815C18.815 3.05333 15.7633 0.00166321 12 0.00166321Z" fill="#E31A2A" />
                            <path d="M14.0733 12.1483C14.0733 13.2933 13.145 14.2217 12 14.2217C10.8566 14.2217 9.92828 13.2933 9.92828 12.1483C9.92828 11.0033 10.8566 10.075 12 10.075C13.145 10.075 14.0733 11.0033 14.0733 12.1483Z" fill="#E31A2A" />
                        </g>
                        <defs>
                            <clipPath id="clip0_76_2">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <input className={`${CustomClass({ component, version, customClass: "login-form-child-input" })} ${CustomClass({ component, version, customClass: "login-form-child-password" })}`} placeholder='Contraseña' type="password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                        error: {
                            isError: false,
                            message: ''
                        }
                    }))} required />
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-4" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "login-form-child-input-container-options" })} ${CustomClass({ component, version, customClass: "login-form-child-options-remember" })}`}>
                        <input className={`${CustomClass({ component, version, customClass: "login-form-child-input-check" })} ${CustomClass({ component, version, customClass: "login-form-child-remember" })}`} type="checkbox" name="checkbox-login" id="checkbox-login" />
                        <label className={`${CustomClass({ component, version, customClass: "login-form-child-input-check" })} ${CustomClass({ component, version, customClass: "login-form-child-label-remember" })}`} htmlFor="checkbox-login">Recordarme</label>
                    </div>
                    <div className={`${CustomClass({ component, version, customClass: "login-form-child-input-container-options" })} ${CustomClass({ component, version, customClass: "login-form-child-options-reset" })}`}>
                        <Link className={`${CustomClass({ component, version, customClass: "nav-link-reset-password" })} ${CustomClass({ component, version, customClass: "nav-link-reset-password" })}`} to="/reset-password">
                            <span className={`${CustomClass({ component, version, customClass: "span-icon-reset-password" })} ${CustomClass({ component, version, customClass: "span-icon-reset-password" })}`}>Recuperar contraseña</span>
                        </Link>
                    </div>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-5" })}`}>
                    <button className={`${CustomClass({ component, version, customClass: "login-form-submit" })}`} type="submit">Iniciar sesión</button>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child-input-container-options" })} ${CustomClass({ component, version, customClass: "login-form-child-options-error" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "login-form-child-span-error" })}`}>{loginForm.error.message}</span>
                </div>
            </form>
        </div>
    );
};

export default Login;
