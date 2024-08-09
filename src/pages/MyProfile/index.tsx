import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import CustomClass from '../../utils/CustomClass';
import { decryptData } from '../../utils/Decrypt';
import { getApuUrl } from '../../utils/config';

import Swal from "sweetalert2";
import { login, logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { clearMessage, resetcart } from '../../features/cart/cartSlice';

interface Profile {
  userNick: string | undefined,
  userName: string | undefined,
  email: string | undefined,
}

interface Form {
  identidad: "MASCULINO" | "FEMENINO" | null
}

const component: string = "my-profile"
const version: string = "0"

const MyProfile = ({ setShowProfile }: any) => {

  const profile = useSelector((state: RootState) => state.auth);
  const { user, nombre, correo, gender, rol, grupo, pais, administrador, token } = useSelector((state: RootState) => state.auth);

  const [userFull, setUserFull] = useState<Profile>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [myProfileData, setMyProfileData] = useState<Form>({
    identidad: null
  })

  const decryptProfile = useCallback(async () => {

    if (user && nombre && correo) {
      setUserFull({
        userNick: decryptData(user).data,
        userName: decryptData(nombre).data,
        email: decryptData(correo).data,
      })
    }

  }, [correo, nombre, user]);


  const handleSaveChanges = async () => {


    Swal.fire({
      title: "¡Importante!",
      text: `Esta acción borrara la selección de prendas, ¿Esta de acuerdo?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Continuar",
      confirmButtonColor: "#4D4D4D",
      denyButtonText: `No guardar`
    }).then((result) => {

      if (result.isConfirmed) {

        if (myProfileData.identidad) {
          const url = getApuUrl("/actualizarIdentidad");

          const raw = JSON.stringify({
            "usuario": userFull?.userNick,
            "identidad": myProfileData.identidad
          });

          const requestOptions = {
            method: "POST",
            headers: {
              token: token,
              "Content-Type": "application/json"
            },
            body: raw
          };

          fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result: ResponseAPI) => {

              if (result.code !== 200) {
                return Swal.fire({ title: 'Error al cambiar de expresión de genero', text: `Ha ocurrido un error al intentar cambiar la expresión de genero`, icon: 'error', confirmButtonColor: "#E31A2A" });
              }

              const copyProfile = { ...profile };

              copyProfile.identidad = myProfileData.identidad
              copyProfile.token = result.token


              dispatch(login(copyProfile));
              dispatch(clearMessage())
              dispatch(resetcart());

              setMyProfileData({
                identidad: null
              });

              Swal.fire({ title: 'Seleccionado correctamente', text: `Tu expresión de genero ha sido cambiada`, icon: 'success', confirmButtonColor: "#E31A2A" });


            })
            .catch((error) => {
              console.log(error, " error");
              Swal.fire({ title: 'Ha ocurrido un error', text: `No se ha definido correctamente tu expresión`, icon: 'error', confirmButtonColor: "#E31A2A" });
            });
        }

      } else if (result.isDenied) {
        Swal.fire({
          title: 'No se ha guardado',
          text: `No has realizado ningún cambio en tu expresión de genero`,
          icon: 'info',
          confirmButtonColor: "#E31A2A"
        }
        );
      }
    });

  }

  const handleLogout = async () => {

    dispatch(logout());
    dispatch(resetcart())
    navigate('/login');

  }

  useEffect(() => {
    decryptProfile()
  }, [decryptProfile])


  return ReactDOM.createPortal(

    <div className={`${CustomClass({ component, version, customClass: "my-profile-overlay" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "my-profile" })}`}>
        <button className={`${CustomClass({ component, version, customClass: "my-profile-button-close" })}`} onClick={() => setShowProfile(false)} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_12_2)">
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
        <div className={`${CustomClass({ component, version, customClass: "my-profile-container" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "my-profile-1" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "my-profile-title" })}`}>Mi perfil</span>
          </div>
          <div className={`${CustomClass({ component, version, customClass: "my-profile-2" })}`}>

            <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child-1" })}`}>
              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-user" })}`}>Usuario:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{userFull?.userNick}</span>
                </div>
              </div>

              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-name" })}`}>Nombre:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{userFull?.userName}</span>
                </div>
              </div>

              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-email" })}`}>Correo:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{userFull?.email}</span>
                </div>
              </div>

              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-gender" })}`}>Genero:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{gender}</span>
                </div>
              </div>

              {/* <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-preference" })}`}>Me identifico como:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <select onChange={(e: any) => setMyProfileData((prev) => ({
                    ...prev,
                    identidad: e.target.value
                  }))} className={`${CustomClass({ component, version, customClass: "my-profile-select-preference" })}`} defaultValue={identidad ? identidad : ""}>
                    <option value={""} disabled={true}>Selecciona tu expresión de genero</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                  </select>
                </div>
              </div> */}

            </div>

            <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child-2" })}`}>

              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-role" })}`}>Rol:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{rol}</span>
                </div>
              </div>


              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-group" })}`}>Grupo:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{grupo}</span>
                </div>
              </div>

              <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-country" })}`}>País:</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                  <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{pais}</span>
                </div>
              </div>


              {administrador &&
                <div className={`${CustomClass({ component, version, customClass: "my-profile-2-child" })}`}>
                  <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "my-profile-admin" })}`}>Es administrador:</span>
                  </div>
                  <div className={`${CustomClass({ component, version, customClass: "my-profile-container-child" })} ${CustomClass({ component, version, customClass: "my-profile-container-child-2" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "my-profile-value-span" })}`}>{administrador ? "Sí" : "No"}</span>
                  </div>
                </div>}

            </div>

          </div>
          <div className={`${CustomClass({ component, version, customClass: "my-profile-3" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "my-profile-box-footer-box" })} ${CustomClass({ component, version, customClass: "my-profile-footer-box-1" })}`}>
              <button onClick={() => handleSaveChanges()} className={`${CustomClass({ component, version, customClass: "my-profile-button-footer" })} ${CustomClass({ component, version, customClass: "my-profile-save-changes" })}`} type="button">Guardar cambios</button>
            </div>
            <div className={`${CustomClass({ component, version, customClass: "my-profile-box-footer-box" })} ${CustomClass({ component, version, customClass: "my-profile-footer-box-2" })}`}>
              <button onClick={() => handleLogout()} className={`${CustomClass({ component, version, customClass: "my-profile-button-footer" })} ${CustomClass({ component, version, customClass: "my-profile-sesion" })}`} type="button">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div >
    </div>
    ,
    document.body
  )
}

export default MyProfile