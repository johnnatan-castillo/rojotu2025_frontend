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
                const dashboard = data?.dashboard;

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
                    dashboard
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
        window.open("https://sites.google.com/davivienda.com/rojotu/preguntas-frecuentes-rojot%C3%BA/selecci%C3%B3n-de-prendas ", "_blank");
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

            {isMobile ? <div className={`${CustomClass({ component, version, customClass: "box-logo" })}`}>
                <svg width="563" height="175" viewBox="0 0 863 275" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M295.831 171.268H266.92L230.262 120.714C227.547 120.822 225.338 120.875 223.634 120.875C222.941 120.875 222.197 120.862 221.398 120.834C220.599 120.807 219.774 120.768 218.922 120.714V152.131C218.922 158.937 219.667 163.162 221.159 164.809C223.181 167.149 226.215 168.318 230.262 168.318H234.497V171.268H188.094V168.318H192.167C196.746 168.318 200.021 166.83 201.991 163.852C203.109 162.205 203.667 158.298 203.667 152.131V82.2801C203.667 75.4762 202.922 71.2509 201.431 69.6015C199.355 67.2639 196.266 66.0924 192.167 66.0924H188.094V63.1424H227.547C239.047 63.1424 247.526 63.9798 252.983 65.6558C258.44 67.3291 263.074 70.4136 266.88 74.9051C270.686 79.3966 272.591 84.7521 272.591 90.9716C272.591 97.6184 270.42 103.385 266.083 108.275C261.742 113.166 255.02 116.623 245.915 118.641L268.279 149.66C273.388 156.783 277.782 161.514 281.455 163.852C285.131 166.192 289.922 167.681 295.831 168.318V171.268ZM218.922 115.691C219.933 115.691 220.811 115.704 221.558 115.73C222.302 115.758 222.915 115.771 223.395 115.771C233.723 115.771 241.51 113.537 246.754 109.072C251.998 104.606 254.622 98.919 254.622 92.0086C254.622 85.258 252.504 79.7694 248.272 75.5427C244.039 71.3161 238.435 69.2035 231.461 69.2035C228.373 69.2035 224.194 69.7093 218.922 70.7184V115.691ZM341.129 60.6714C355.184 60.6714 367.364 66.0003 377.666 76.6594C387.968 87.3171 393.12 100.621 393.12 116.567C393.12 132.994 387.928 146.63 377.547 157.474C367.164 168.318 354.598 173.74 339.85 173.74C324.941 173.74 312.418 168.452 302.275 157.872C292.133 147.294 287.059 133.606 287.059 116.806C287.059 99.6363 292.915 85.6305 304.63 74.7864C314.798 65.3746 326.965 60.6714 341.129 60.6714ZM339.61 66.4929C329.919 66.4929 322.147 70.0805 316.289 77.2571C308.995 86.1869 305.349 99.2635 305.349 116.49C305.349 134.138 309.129 147.72 316.69 157.234C322.491 164.464 330.159 168.08 339.69 168.08C349.859 168.08 358.259 164.119 364.887 156.197C371.518 148.278 374.831 135.786 374.831 118.721C374.831 100.221 371.183 86.4266 363.888 77.337C358.032 70.1085 349.939 66.4929 339.61 66.4929ZM402.635 66.0928V63.1428H449.036V66.0928H445.123C440.703 66.0928 437.483 67.3974 435.46 69.9999C434.183 71.7026 433.544 75.7961 433.544 82.2805V135.147C433.544 143.28 432.651 149.872 430.868 154.923C429.083 159.973 426.008 164.37 421.643 168.119C417.276 171.866 412.006 173.739 405.831 173.739C400.826 173.739 396.884 172.504 394.011 170.033C391.135 167.561 389.696 164.73 389.696 161.54C389.696 158.937 390.363 156.97 391.695 155.64C393.451 153.992 395.5 153.169 397.843 153.169C399.547 153.169 401.079 153.726 402.436 154.841C403.794 155.958 405.511 158.937 407.587 163.774C408.811 166.644 410.383 168.079 412.3 168.079C413.736 168.079 415.08 167.203 416.334 165.447C417.583 163.694 418.21 160.583 418.21 156.119V82.2805C418.21 76.8065 417.862 73.1909 417.171 71.4363C416.638 70.1078 415.52 68.9643 413.818 68.0071C411.526 66.7318 409.104 66.0928 406.548 66.0928H402.635ZM496.73 60.6714C510.786 60.6714 522.966 66.0003 533.268 76.6594C543.57 87.3171 548.722 100.621 548.722 116.567C548.722 132.994 543.53 146.63 533.148 157.474C522.765 168.318 510.198 173.74 495.452 173.74C480.543 173.74 468.019 168.452 457.876 157.872C447.735 147.294 442.661 133.606 442.661 116.806C442.661 99.6363 448.517 85.6305 460.232 74.7864C470.4 65.3746 482.567 60.6714 496.73 60.6714ZM495.212 66.4929C485.521 66.4929 477.749 70.0805 471.891 77.2571C464.597 86.1869 460.951 99.2635 460.951 116.49C460.951 134.138 464.731 147.72 472.292 157.234C478.093 164.464 485.76 168.08 495.292 168.08C505.461 168.08 513.861 164.119 520.489 156.197C527.12 148.278 530.433 135.786 530.433 118.721C530.433 100.221 526.785 86.4266 519.49 77.337C513.634 70.1085 505.541 66.4929 495.212 66.4929ZM791.569 64.6765C789.539 64.7631 789.157 65.3608 789.157 67.5506V76.535C789.157 79.3067 788.822 81.3501 787.931 82.8663C786.938 84.5437 784.905 85.6539 782.452 85.6539C780.538 85.6539 778.742 85.2599 777.426 84.0338C775.658 82.3858 775.206 80.6938 775.206 76.6242V67.2445C775.206 65.0692 774.824 64.7631 772.779 64.6765V64.0788C773.626 64.1361 775.058 64.1653 776.608 64.1653C777.995 64.1653 779.485 64.1361 780.421 64.0788V64.6765C778.376 64.7631 777.995 65.0692 777.995 67.2445V77.1341C777.995 81.2329 778.463 84.6022 782.716 84.6022C787.229 84.6022 788.458 81.3208 788.458 76.8705V67.5506C788.458 65.3608 787.77 64.7631 785.739 64.6765V64.0788C786.456 64.1361 787.769 64.1653 788.793 64.1653C789.816 64.1653 790.911 64.1361 791.569 64.0788V64.6765Z" fill="white" />
                    <path d="M810.026 64.6766C807.994 64.7631 807.602 65.3608 807.602 67.5507V85.3757H806.914L794.349 65.9892V81.7588C794.349 83.9473 794.745 84.5437 797.066 84.6316V85.2306C796.351 85.1721 795.034 85.1414 794.013 85.1414C793.006 85.1414 791.894 85.1721 791.238 85.2306V84.6316C793.267 84.5437 793.662 83.9473 793.662 81.7588V67.2445C793.662 65.0693 793.267 64.7631 791.238 64.6766V64.0789C791.894 64.1361 793.006 64.1654 794.013 64.1654C794.89 64.1654 795.693 64.1361 796.351 64.0789L806.914 80.3291V67.5507C806.914 65.3608 806.535 64.7631 804.197 64.6766V64.0789C804.913 64.1361 806.229 64.1654 807.25 64.1654C808.258 64.1654 809.37 64.1361 810.026 64.0789V64.6766ZM788.764 114.013C786.733 113.926 783.912 113.925 781.912 113.925C780.115 113.925 776.169 113.926 773.233 114.013V113.416C775.263 113.326 775.657 113.022 775.657 110.848V96.0272C775.657 93.852 775.263 93.5458 773.233 93.4606V92.8629C776.169 92.9481 780.115 92.9481 781.912 92.9481C783.737 92.9481 786.309 92.9481 788.165 92.8629C788.017 94.262 787.961 95.7064 787.961 96.3907C787.961 97.1069 787.991 97.7911 788.047 98.2437H787.361C786.967 94.7133 786.513 93.5458 783.343 93.5458H780.859C778.828 93.5458 778.433 93.852 778.433 96.0272V103.073H780.421C783.023 103.073 782.963 100.564 783.197 99.1343H783.884C783.796 100.403 783.783 101.264 783.783 101.949C783.783 102.504 783.796 102.942 783.796 103.378C783.796 104.355 783.825 105.348 783.971 107.624H783.285C783.051 105.713 783.023 103.671 780.421 103.671H778.433V110.848C778.433 113.022 778.828 113.326 780.859 113.326H783.051C786.792 113.326 787.536 111.986 787.961 108.034H788.645C788.588 108.573 788.56 109.359 788.56 110.19C788.56 110.936 788.616 112.497 788.764 114.013ZM799.101 93.6348C799.582 93.9409 799.845 94.0568 800.122 94.0568C800.504 94.0568 800.664 93.6055 800.781 92.7442H801.466C801.38 93.7958 801.321 95.0791 801.321 98.8425H800.636C800.416 95.9977 799.042 93.0956 795.726 93.0956C793.593 93.0956 792.072 94.5094 792.072 96.5661C792.072 99.2791 794.41 100.36 797.1 102.037C800.212 103.977 802.49 105.552 802.49 108.763C802.49 112.554 799.613 114.438 796.134 114.438C794.016 114.438 792.905 113.868 792.042 113.328C791.561 113.021 791.269 112.906 791.021 112.906C790.64 112.906 790.481 113.357 790.364 114.218H789.676C789.764 112.992 789.793 111.272 789.793 107.055H790.481C790.729 110.673 792.102 113.839 795.93 113.839C797.874 113.839 799.817 112.673 799.817 109.856C799.817 107.436 797.933 106.064 795.157 104.402C792.306 102.695 789.824 101.075 789.824 97.7043C789.824 94.1739 792.497 92.5272 795.448 92.5272C797.42 92.5272 798.297 93.0956 799.101 93.6348ZM819.051 96.6827C819.051 97.6452 819.08 98.5065 819.139 99.1348H818.451C818.027 94.9761 817.589 93.5464 813.848 93.5464H812.228V110.542C812.228 112.965 812.739 113.327 815.252 113.415V114.014C814.2 113.954 812.476 113.926 810.855 113.926C809.057 113.926 807.377 113.954 806.427 114.014V113.415C808.94 113.327 809.452 112.965 809.452 110.542V93.5464H807.829C804.089 93.5464 803.637 94.9761 803.227 99.1348H802.541C802.597 98.5065 802.628 97.6452 802.628 96.6827C802.628 95.9399 802.571 94.3784 802.409 92.8621C804.892 92.9486 808.399 92.9487 810.855 92.9487C813.308 92.9487 816.772 92.9486 819.255 92.8621C819.109 94.3784 819.051 95.9399 819.051 96.6827Z" fill="white" />
                    <path d="M826.612 93.4601C824.582 93.5467 824.187 93.8528 824.187 96.0281V110.849C824.187 113.021 824.582 113.327 826.612 113.415V114.013C825.691 113.954 824.187 113.925 822.812 113.925C821.264 113.925 819.819 113.954 818.987 114.013V113.415C821.015 113.327 821.411 113.021 821.411 110.849V96.0281C821.411 93.8528 821.015 93.5467 818.987 93.4601V92.8624C819.819 92.9197 821.264 92.9489 822.812 92.9489C824.187 92.9489 825.691 92.9197 826.612 92.8624V93.4601ZM834.353 93.4601C832.321 93.5467 831.926 93.8528 831.926 96.0281V110.849C831.926 113.021 832.321 113.327 834.353 113.327H836.545C840.286 113.327 841.03 111.899 841.454 107.741H842.14C842.081 108.368 842.053 109.23 842.053 110.191C842.053 110.936 842.11 112.498 842.257 114.013C840.226 113.925 837.405 113.925 835.405 113.925C833.609 113.925 829.664 113.925 826.726 114.013V113.415C828.756 113.327 829.15 113.021 829.15 110.849V96.0281C829.15 93.8528 828.756 93.5467 826.726 93.4601V92.8624C827.56 92.9197 829.005 92.9489 830.553 92.9489C831.926 92.9489 833.432 92.9197 834.353 92.8624V93.4601ZM861.242 103.263C861.242 109.943 857.298 114.438 851.733 114.438C846.048 114.438 842.25 110.453 842.25 103.612C842.25 96.9321 846.194 92.4379 851.761 92.4379C857.445 92.4379 861.242 96.4196 861.242 103.263ZM845.23 103.496C845.23 109.856 848.166 113.899 851.848 113.899C855.734 113.899 858.249 109.565 858.249 103.379C858.249 97.0186 855.325 92.977 851.644 92.977C847.742 92.977 845.23 97.3102 845.23 103.496ZM791.963 131.989C791.963 138.495 788.019 142.799 781.136 142.799C780.231 142.799 778.229 142.711 776.944 142.711C775.541 142.711 774.067 142.74 773.233 142.799V142.201C775.263 142.112 775.657 141.807 775.657 139.633V124.813C775.657 122.638 775.263 122.331 773.233 122.245V121.647C773.919 121.69 775.044 121.75 776.155 121.75C776.404 121.75 776.637 121.734 776.885 121.734C778.259 121.704 780.26 121.647 781.4 121.647C788.531 121.647 791.963 125.323 791.963 131.989ZM778.433 124.754V139.692C778.433 141.777 778.828 142.26 780.684 142.26C787.201 142.26 788.969 138.611 788.969 132.105C788.969 125.411 786.849 122.186 780.655 122.186C778.828 122.186 778.433 122.696 778.433 124.754ZM807.734 142.799C805.702 142.711 802.882 142.711 800.882 142.711C799.084 142.711 795.139 142.711 792.203 142.799V142.201C794.231 142.112 794.627 141.807 794.627 139.633V124.813C794.627 122.637 794.231 122.331 792.203 122.246V121.647C795.139 121.734 799.084 121.734 800.882 121.734C802.706 121.734 805.278 121.734 807.135 121.647C806.987 123.047 806.93 124.492 806.93 125.176C806.93 125.892 806.959 126.577 807.016 127.029H806.331C805.936 123.499 805.482 122.331 802.311 122.331H799.828C797.798 122.331 797.402 122.637 797.402 124.813V131.859H799.39C801.991 131.859 801.932 129.349 802.167 127.92H802.854C802.766 129.188 802.752 130.05 802.752 130.734C802.752 131.29 802.766 131.727 802.766 132.164C802.766 133.141 802.795 134.134 802.94 136.409H802.255C802.02 134.499 801.991 132.457 799.39 132.457H797.402V139.633C797.402 141.807 797.798 142.112 799.828 142.112H802.02C805.762 142.112 806.506 140.771 806.93 136.819H807.615C807.556 137.358 807.53 138.145 807.53 138.977C807.53 139.721 807.586 141.283 807.734 142.799ZM791.043 150.431V151.03C790.253 151.203 789.363 151.831 788.675 153.624L781.649 171.728H781.166L773.859 152.939C773.261 151.421 772.43 151.056 771.801 151.03V150.431C772.605 150.488 773.859 150.517 775.001 150.517C776.549 150.517 777.995 150.488 778.827 150.431V151.03C777.395 151.086 776.71 151.305 776.71 152.137C776.71 152.486 776.826 152.939 777.059 153.538L782.482 167.891L787.362 155.274C787.754 154.251 787.961 153.45 787.961 152.838C787.961 151.524 787.055 151.072 785.345 151.03V150.431C786.483 150.488 787.741 150.517 788.794 150.517C789.815 150.517 790.445 150.488 791.043 150.431Z" fill="white" />
                    <path d="M797.301 151.029C795.271 151.116 794.875 151.42 794.875 153.596V168.416C794.875 170.59 795.271 170.896 797.301 170.984V171.582C796.38 171.523 794.875 171.494 793.503 171.494C791.955 171.494 790.508 171.523 789.676 171.582V170.984C791.706 170.896 792.1 170.59 792.1 168.416V153.596C792.1 151.42 791.706 151.116 789.676 151.029V150.43C790.508 150.487 791.955 150.517 793.503 150.517C794.875 150.517 796.38 150.487 797.301 150.43V151.029ZM816.149 160.773C816.149 167.279 812.203 171.583 805.321 171.583C804.416 171.583 802.413 171.493 801.128 171.493C799.727 171.493 798.251 171.524 797.417 171.583V170.984C799.447 170.896 799.841 170.59 799.841 168.417V153.597C799.841 151.421 799.447 151.115 797.417 151.029V150.431C798.103 150.473 799.229 150.532 800.339 150.532C800.588 150.532 800.823 150.517 801.069 150.517C802.443 150.488 804.445 150.431 805.584 150.431C812.716 150.431 816.149 154.106 816.149 160.773ZM802.617 153.538V168.476C802.617 170.56 803.013 171.043 804.869 171.043C811.385 171.043 813.153 167.395 813.153 160.889C813.153 154.193 811.033 150.97 804.84 150.97C803.013 150.97 802.617 151.48 802.617 153.538ZM831.728 169.074C832.328 170.59 833.174 170.955 833.802 170.984V171.582C832.985 171.523 831.728 171.494 830.588 171.494C829.038 171.494 827.608 171.523 826.76 171.582V170.984C828.208 170.926 828.88 170.707 828.88 169.877C828.88 169.525 828.761 169.074 828.528 168.475L826.686 163.573H819.469L818.241 166.739C817.833 167.775 817.642 168.577 817.642 169.188C817.642 170.488 818.534 170.94 820.244 170.984V171.582C819.104 171.523 817.846 171.494 816.796 171.494C815.788 171.494 815.16 171.523 814.56 171.582V170.984C815.334 170.81 816.226 170.181 816.912 168.387L823.954 150.284H824.438L831.728 169.074ZM823.121 154.063L819.688 162.975H826.466L823.121 154.063ZM761.285 174.504H760.221V58.0198H761.285V174.504ZM561.195 174.504H560.131V58.0198H561.195V174.504ZM862.252 80.3137H813.568V81.2802H862.252V80.3137ZM862.252 140.705H813.568V141.671H862.252V140.705ZM638.5 63.9295V68.1108H607.558V148.965C607.558 162.119 612.56 166.708 620.935 166.708C629.309 166.708 635.437 160.692 639.828 144.378L643.912 145.398C641.053 161.71 633.7 174.254 616.749 174.254C607.148 174.254 601.532 171.907 596.938 167.32C590.808 161.101 588.767 152.943 588.767 138.057V68.1108H568.648V63.9295H588.767V32.0161C595.61 31.8124 602.35 30.9977 607.558 29.0595V63.9295H638.5ZM738.695 148.761C738.695 161.304 742.472 167.116 754.626 167.116V171.5C750.235 171.092 745.842 170.889 741.655 170.889C733.485 170.889 725.928 171.704 719.903 173.845V149.17C712.757 167.32 698.969 174.254 685.591 174.254C675.786 174.254 668.637 171.296 663.838 166.3C658.63 160.693 656.894 152.128 656.894 138.974V86.5666C656.894 74.0238 653.218 68.1119 641.063 68.1119V63.7255C645.457 64.1329 649.847 64.3379 654.035 64.3379C662.203 64.3379 669.659 63.5232 675.786 61.4838V143.561C675.786 156.512 676.603 167.523 691.617 167.523C707.954 167.523 719.903 151.006 719.903 129.695V86.5666C719.903 74.0238 716.125 68.1119 703.973 68.1119V63.7255C708.363 64.1329 712.757 64.3379 716.942 64.3379C725.112 64.3379 732.667 63.5232 738.695 61.4838V148.761ZM721.435 7.34166C721.435 9.48359 720.515 11.929 718.577 14.4783C712.143 22.636 702.031 28.6518 685.489 46.188L683.242 44.3536C696.211 24.0645 699.785 12.8476 706.015 4.6912C708.567 1.32588 711.427 -1.74142e-06 713.979 -1.74142e-06C715.717 -1.74142e-06 717.249 0.509838 718.577 1.52955C720.311 2.95795 721.435 4.99472 721.435 7.34166ZM81.9695 171.72C77.1881 171.72 67.2468 170.916 60.5495 168.766C37.2402 173.888 19.6456 164.485 12.5216 152.839C6.3883 142.81 7.60164 130.997 15.7643 121.233C22.7989 111.816 24.5803 103.419 24.9389 98.5307C23.7589 98.5919 22.5629 98.6505 21.3389 98.7104C10.991 99.2229 2.86564 95.9095 0.633646 90.2532C-0.827684 86.551 -0.470341 80.3715 9.52297 71.9582C15.203 67.1898 25.4843 59.7562 25.5883 59.6817C31.8349 54.8733 44.7909 47.26 46.9149 46.0606C61.8628 37.5967 74.9655 32.5234 81.9628 32.4901C88.5454 32.5208 100.5 36.9963 114.309 44.5497C114.021 42.5648 114.377 40.8209 115.349 39.5443C116.565 37.9482 118.613 37.1388 121.439 37.1388H134.181C137.531 37.1388 139.651 37.8563 140.851 39.3952C142.632 41.6809 141.788 45.0103 140.812 48.8682C139.935 52.3546 139.268 56.4189 138.956 60.1316C141.252 61.8289 149.559 68.0058 154.431 72.11C164.407 80.5006 164.775 86.6389 163.328 90.3104C161.111 95.9335 152.967 99.2269 142.589 98.7104L141.916 98.6771C140.935 98.6279 139.964 98.58 139.005 98.5307C139.364 103.418 141.143 111.815 148.169 121.233C156.335 130.995 157.548 142.807 151.415 152.837C145.659 162.25 133.063 170.196 116.14 170.197C112.121 170.197 107.86 169.748 103.388 168.766C96.6948 170.914 86.7508 171.72 81.9695 171.72ZM60.6175 166.03C60.7615 166.03 60.9055 166.053 61.0455 166.099C67.0975 168.123 76.9241 169.032 81.9695 169.032C87.0161 169.032 96.8427 168.123 102.892 166.101C103.125 166.021 103.376 166.009 103.616 166.064C125.808 171.07 142.459 162.325 149.117 151.437C154.709 142.293 153.601 131.903 146.081 122.928C146.064 122.908 146.049 122.889 146.035 122.869C137.785 111.828 136.359 102.012 136.243 97.1436C136.233 96.7681 136.381 96.4074 136.651 96.1465C136.92 95.8856 137.289 95.7458 137.66 95.7697C139.095 95.8469 140.561 95.9188 142.049 95.9934L142.723 96.0267C151.791 96.4833 159.063 93.7875 160.823 89.3253C162.413 85.2944 159.527 79.9096 152.697 74.1653H152.696C147.099 69.4502 136.863 61.9274 136.76 61.8529C136.388 61.58 136.181 61.134 136.215 60.6734C136.507 56.6198 137.231 52.0777 138.201 48.2119C138.973 45.1674 139.701 42.2946 138.727 41.0459C138.096 40.2365 136.567 39.8265 134.181 39.8265H121.439C119.499 39.8265 118.171 40.2778 117.492 41.171C116.588 42.3572 116.919 44.2076 117.196 45.206C117.248 45.3923 117.301 45.5774 117.355 45.7638C117.464 46.1458 117.573 46.5266 117.667 46.906C117.797 47.4265 117.604 47.9749 117.176 48.2997C116.747 48.6246 116.167 48.6632 115.697 48.3983C101.132 40.1513 88.5201 35.2085 81.9628 35.1766C75.4188 35.2085 62.8082 40.1513 48.2415 48.3983C46.1442 49.5844 33.3536 57.0964 27.1976 61.8342C27.0629 61.9328 16.8603 69.3091 11.2576 74.0136C4.41364 79.7751 1.52965 85.1919 3.13765 89.2681C4.91098 93.7636 12.1736 96.4806 21.2056 96.0267C22.9429 95.9415 24.6243 95.8576 26.2843 95.7697C26.6536 95.7498 27.0243 95.8856 27.2936 96.1465C27.5629 96.4074 27.7109 96.7681 27.7016 97.1436C27.5843 102.013 26.1563 111.832 17.8989 122.869C17.8843 122.889 17.8696 122.909 17.8536 122.928C10.3323 131.903 9.2283 142.295 14.819 151.439C21.4776 162.325 38.1282 171.07 60.3202 166.064C60.4188 166.041 60.5175 166.03 60.6175 166.03Z" fill="white" />
                </svg>
            </div> : <></>}

            <img className={`${CustomClass({ component, version, customClass: "login-baner" })}`} src={imageSrc} alt="Baner login rojo tú" />
            <form onSubmit={(e) => handleSubmit(e)} className={`${CustomClass({ component, version, customClass: "login-container-form" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "login-title-span" })}`}>Iniciar Sesión</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "login-form-child" })} ${CustomClass({ component, version, customClass: "login-form-child-2" })}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5925 3.02719C14.6803 2.04234 13.4063 1.5 12 1.5C10.5863 1.5 9.30799 2.03906 8.40002 3.01781C7.48221 4.00734 7.03502 5.35219 7.14002 6.80437C7.34815 9.66937 9.52831 12 12 12C14.4717 12 16.6481 9.66984 16.8596 6.80531C16.966 5.36625 16.516 4.02422 15.5925 3.02719ZM20.25 22.5H3.75002C3.53405 22.5028 3.32017 22.4574 3.12394 22.3672C2.92772 22.2769 2.75407 22.1441 2.61565 21.9783C2.31096 21.6141 2.18815 21.1167 2.27909 20.6137C2.67471 18.4191 3.9094 16.5755 5.85002 15.2812C7.57409 14.1323 9.75799 13.5 12 13.5C14.2421 13.5 16.426 14.1328 18.15 15.2812C20.0906 16.575 21.3253 18.4186 21.721 20.6133C21.8119 21.1162 21.6891 21.6136 21.3844 21.9778C21.246 22.1437 21.0724 22.2766 20.8762 22.367C20.6799 22.4573 20.466 22.5028 20.25 22.5Z" fill="#EF0F0F" />
                    </svg>
                    <input className={`${CustomClass({ component, version, customClass: "login-form-child-input" })} ${CustomClass({ component, version, customClass: "login-form-child-email" })}`} placeholder='Correo Institucional' type="email" value={loginForm.email} onChange={(e) => setLoginForm((prev) => ({
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
                    <button onClick={() => hanldeHref()} className={`${CustomClass({ component, version, customClass: "login-form-help" })}`}>
                    Soporte
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
