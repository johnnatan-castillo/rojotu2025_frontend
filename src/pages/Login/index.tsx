import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { login } from '../../features/auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { getApuUrl } from '../../utils/config';

import CustomClass from '../../utils/CustomClass';
import { encryptData } from '../../utils/Decrypt';
import { addClothingItem, resetcart, setStatus } from '../../features/cart/cartSlice';

const component: string = "login"
const version: string = "0"

const Login: React.FC = () => {

    const [imageSrc, setImageSrc] = useState("");
    const [isMobile, setIsMobile] = useState<boolean>(false);
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

                dispatch(resetcart())

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
                const cargo = data?.cargo;
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
                    cargo,
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

                if (data) {
                    if (data.carrito) {
                        if (data.carrito.length > 0) {

                            const cartOrderId = {
                                LUNES: uuidv4(),
                                MARTES: uuidv4(),
                                MIERCOLES: uuidv4(),
                                JUEVES: uuidv4(),
                                VIERNES: uuidv4(),
                                SABADO: uuidv4(),
                            }

                            data.carrito.map((product: Product) => {

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

                            });


                            dispatch(setStatus({ status: data.estado }));
                        }
                    }
                }

            })
    }

    const handleRecoverPassword = async () => {
        const { value: email } = await Swal.fire({
            title: 'Ingresa tu dirección de correo electronico',
            input: 'text',
            inputLabel: 'Correo electronico',
            inputPlaceholder: 'example@correo.com',
            confirmButtonColor: "#E31A2A",
            confirmButtonText: "Recuperar contraseña"
        })

        if (email) {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "usuario": encryptData(email).data
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            };

            let requestCode;

            try {

                const url = getApuUrl("/solicitarCodigo");

                requestCode = await fetch(url, requestOptions);
                requestCode = await requestCode.json();

            } catch (error) {
                return Swal.fire({ title: 'Error al solicitar el codigo', text: 'Ha ocurrido un error al solicitar el codigo para restablecer la contraseña', icon: 'info', confirmButtonColor: "#E31A2A" });
            }

            if (requestCode.code === 200) {

                Swal.fire({
                    title: `Se ha enviado el correo`,
                    input: 'text',
                    inputLabel: 'Codigo de verificación',
                    inputPlaceholder: '12345',
                    html: `<p>Se ha enviado un email a tu correo para restablecer la contraseña</p><span><span><strong>${email}</strong></span>`,
                    confirmButtonColor: "#E31A2A"
                }).then(({ value: codigo }) => {

                    Swal.fire({
                        title: `Nueva contraseña`,
                        input: 'text',
                        inputLabel: 'Contraseña nueva',
                        inputPlaceholder: '12345',
                        text: ``,
                        confirmButtonColor: "#E31A2A"
                    }).then(({ value: contrasena }) => {

                        var myHeaders1 = new Headers();
                        myHeaders1.append("Content-Type", "application/json");

                        var raw1 = JSON.stringify({
                            "usuario": encryptData(email).data,
                            "codigo": codigo,
                            "nueva_contrasena": encryptData(contrasena).data
                        });

                        var requestOptions1 = {
                            method: 'POST',
                            headers: myHeaders1,
                            body: raw1
                        };

                        let requestChangePassword;

                        try {
                            const request = async () => {
                                try {

                                    const url = getApuUrl("/cambiarContrasena")

                                    requestChangePassword = await fetch(url, requestOptions1);
                                    requestChangePassword = await requestChangePassword.json();

                                    if (requestChangePassword.code === 200) {
                                        return Swal.fire({ title: 'Se ha cambiado la contraseña', text: "Tu contraseña ha sido actualizada correctamente, puedes seguir navegando", icon: 'success', confirmButtonColor: "#E31A2A" });

                                    } else if (requestChangePassword.code === 401) {
                                        return Swal.fire({ title: 'Codigo invalido', text: requestChangePassword.message, icon: 'info', confirmButtonColor: "#E31A2A" });
                                    }

                                } catch (error) {
                                    return Swal.fire({ title: 'Error al intentar cambiar la contraseña', text: 'Ha ocurrido un error al intentar cambiar la contraseña', icon: 'info', confirmButtonColor: "#E31A2A" });
                                }
                            }

                            request();
                        } catch (error) {
                            return Swal.fire({ title: 'Error al intentar cambiar la contraseña', text: 'Ha ocurrido un error al intentar cambiar la contraseña', icon: 'info', confirmButtonColor: "#E31A2A" });
                        }
                    })

                })

            } else {
                return Swal.fire({ title: 'Error al solicitar el codigo', text: requestCode.message, icon: 'info', confirmButtonColor: "#E31A2A" });
            }

        }
    }

    const hanldeHref = () => {
        window.open("https://rojotu.davivienda.com/preguntas-frecuentes", "_blank");
    }

    useEffect(() => {
        const loadImage = async () => {

            try {
                const image = isMobile ? await import(`../../assets/baner-rojo-tu-login-n-m.jpg`) : await import(`../../assets/baner-rojo-tu-login-n.jpg`);
                setImageSrc(image.default);
            } catch (error) {
                console.log("Error al cargar la imagen de login");
                const image = await import(`../../assets/baner-rojo-tu-login-n.jpg`);
                setImageSrc(image.default);

            }
        };

        loadImage();
    }, [isMobile]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1025px)');

        // Define la función de callback que se ejecuta cuando cambia la condición
        const handleMediaChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Establece el valor inicial
        setIsMobile(mediaQuery.matches);

        // Escucha los cambios en la condición
        mediaQuery.addEventListener('change', handleMediaChange);

        // Limpia el event listener cuando el componente se desmonta
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);


    return (
        <div className={`${CustomClass({ component, version, customClass: "login" })}`}>
            {/* <img className={`${CustomClass({ component, version, customClass: "login-logo" })}`} src={LOGO} alt="Logo Rojo tú" /> */}
            <img className={`${CustomClass({ component, version, customClass: "login-baner" })}`} src={imageSrc} alt="Baner login rojo tú" />
            <form onSubmit={(e) => handleSubmit(e)} className={`${CustomClass({ component, version, customClass: "login-container-form" })}`}>
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
                        <button onClick={() => { handleRecoverPassword() }} className={`${CustomClass({ component, version, customClass: "nav-link-reset-password" })} ${CustomClass({ component, version, customClass: "nav-link-reset-password" })}`} type="button">
                            <span className={`${CustomClass({ component, version, customClass: "span-icon-reset-password" })} ${CustomClass({ component, version, customClass: "span-icon-reset-password" })}`}>Recuperar contraseña</span>
                        </button>
                    </div>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-5" })}`}>
                    <button className={`${CustomClass({ component, version, customClass: "login-form-submit" })}`} type="submit">Iniciar sesión</button>
                    <button onClick={() => hanldeHref()} className={`${CustomClass({ component, version, customClass: "login-form-help" })}`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3ZM11.7188 17.25C11.5333 17.25 11.3521 17.195 11.1979 17.092C11.0437 16.989 10.9236 16.8426 10.8526 16.6713C10.7817 16.5 10.7631 16.3115 10.7993 16.1296C10.8354 15.9477 10.9247 15.7807 11.0558 15.6496C11.1869 15.5185 11.354 15.4292 11.5359 15.393C11.7177 15.3568 11.9062 15.3754 12.0775 15.4464C12.2488 15.5173 12.3952 15.6375 12.4983 15.7917C12.6013 15.9458 12.6562 16.1271 12.6562 16.3125C12.6562 16.5611 12.5575 16.7996 12.3817 16.9754C12.2058 17.1512 11.9674 17.25 11.7188 17.25ZM13.2863 12.4688C12.5264 12.9788 12.4219 13.4461 12.4219 13.875C12.4219 14.049 12.3527 14.216 12.2297 14.339C12.1066 14.4621 11.9397 14.5312 11.7656 14.5312C11.5916 14.5312 11.4247 14.4621 11.3016 14.339C11.1785 14.216 11.1094 14.049 11.1094 13.875C11.1094 12.848 11.5819 12.0314 12.5541 11.3784C13.4578 10.7719 13.9688 10.3875 13.9688 9.54234C13.9688 8.96766 13.6406 8.53125 12.9614 8.20828C12.8016 8.13234 12.4458 8.05828 12.008 8.06344C11.4586 8.07047 11.032 8.20172 10.7034 8.46609C10.0837 8.96484 10.0312 9.50766 10.0312 9.51562C10.0271 9.6018 10.006 9.68632 9.96919 9.76435C9.93237 9.84238 9.88054 9.9124 9.81667 9.9704C9.75279 10.0284 9.67811 10.0732 9.5969 10.1024C9.51569 10.1315 9.42954 10.1444 9.34336 10.1402C9.25718 10.1361 9.17266 10.115 9.09463 10.0782C9.0166 10.0414 8.94659 9.98953 8.88859 9.92565C8.83059 9.86177 8.78574 9.7871 8.7566 9.70589C8.72745 9.62468 8.71459 9.53852 8.71875 9.45234C8.72391 9.33844 8.80313 8.31234 9.87984 7.44609C10.4381 6.99703 11.1483 6.76359 11.9892 6.75328C12.5845 6.74625 13.1437 6.84703 13.523 7.02609C14.6578 7.56281 15.2812 8.45766 15.2812 9.54234C15.2812 11.1281 14.2214 11.8402 13.2863 12.4688Z" fill="#E31A2A" />
                    </svg>
                    </button>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child-input-container-options" })} ${CustomClass({ component, version, customClass: "login-form-child-options-error" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "login-form-child-span-error" })}`}>{loginForm.error.message}</span>
                </div>
            </form>
        </div>
    );
};

export default Login;
