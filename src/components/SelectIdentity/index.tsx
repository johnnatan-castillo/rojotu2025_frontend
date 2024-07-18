import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import CustomClass from '../../utils/CustomClass';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Swal from "sweetalert2";
import { getApuUrl } from '../../utils/config';
import { decryptData } from '../../utils/Decrypt';
import { login } from '../../features/auth/authSlice';
import Spinner from '../Spinner/intex';

const component: string = "select-identity"
const version: string = "0"


const SelectIdentity = () => {

  const profile = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);

  const handleSelectIdentity = async (preference: "MASCULINO" | "FEMENINO") => {

    setLoading(true)

    const url = getApuUrl("/actualizarIdentidad");

    const raw = JSON.stringify({
      "usuario": decryptData(profile.user).data,
      "identidad": preference
    });

    const requestOptions = {
      method: "POST",
      headers: {
        token: profile.token,
        "Content-Type": "application/json"
      },
      body: raw
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result: ResponseAPI) => {

        setLoading(false)

        if (result.code !== 200) {
          return Swal.fire({ title: 'Error al cambiar de expresión de genero', text: `Ha ocurrido un error al intentar cambiar la expresión de genero`, icon: 'error', confirmButtonColor: "#E31A2A" });
        }

        const copyProfile = { ...profile };

        copyProfile.identidad = preference
        copyProfile.token = result.token

        dispatch(login(copyProfile));

        Swal.fire({ title: 'Seleccionado correctamente', text: `Tu expresión de genero ha sido cambiada`, icon: 'success', confirmButtonColor: "#E31A2A" });


      })
      .catch((error) => {
        setLoading(false)
        console.log(error, " error");
        Swal.fire({ title: 'Ha ocurrido un error', text: `No se ha definido correctamente tu expresión`, icon: 'error', confirmButtonColor: "#E31A2A" });
      });

  }


  return <>
    {
      !profile.identidad && ReactDOM.createPortal(
        <div className={`${CustomClass({ component, version, customClass: "select-identity-overlay" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "select-identity-container" })}`}>
            {
              !loading
                ? <>
                  <div className={`${CustomClass({ component, version, customClass: "select-identity-box-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "select-identity-box-2-title" })}`}>¿Con cuál de las siguientes expresiones de género te sientes identificado?</span>
                  </div>

                  <div className={`${CustomClass({ component, version, customClass: "select-identity-box-2" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "select-identity-box-2-1" })}`}>
                      <div className={`${CustomClass({ component, version, customClass: "select-identity-box-child" })}`}>
                        <span className={`${CustomClass({ component, version, customClass: "select-identity-box-2-icon" })}`}>
                          <svg
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M15.5925 3.02719C14.6803 2.04234 13.4063 1.5 12 1.5C10.5863 1.5 9.30799 2.03906 8.40002 3.01781C7.48221 4.00734 7.03502 5.35219 7.14002 6.80437C7.34815 9.66937 9.52831 12 12 12C14.4717 12 16.6481 9.66984 16.8596 6.80531C16.966 5.36625 16.516 4.02422 15.5925 3.02719ZM20.25 22.5H3.75002C3.53405 22.5028 3.32017 22.4574 3.12394 22.3672C2.92772 22.2769 2.75407 22.1441 2.61565 21.9783C2.31096 21.6141 2.18815 21.1167 2.27909 20.6137C2.67471 18.4191 3.9094 16.5755 5.85002 15.2812C7.57409 14.1323 9.75799 13.5 12 13.5C14.2421 13.5 16.426 14.1328 18.15 15.2812C20.0906 16.575 21.3253 18.4186 21.721 20.6133C21.8119 21.1162 21.6891 21.6136 21.3844 21.9778C21.246 22.1437 21.0724 22.2766 20.8762 22.367C20.6799 22.4573 20.466 22.5028 20.25 22.5Z"
                              fill="#878787"></path>
                          </svg>
                        </span>
                      </div>
                      <div className={`${CustomClass({ component, version, customClass: "select-identity-box-child" })}`}>
                        <button onClick={() => handleSelectIdentity("MASCULINO")} className={`${CustomClass({ component, version, customClass: "select-identity-box-button" })}`} type="button">MASCULINO</button>
                      </div>
                    </div>
                    <div className={`${CustomClass({ component, version, customClass: "select-identity-box-2-2" })}`}>
                      <div className={`${CustomClass({ component, version, customClass: "select-identity-box-child" })}`}>
                        <span className={`${CustomClass({ component, version, customClass: "select-identity-box-2-icon" })}`}>
                          <svg
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M15.5925 3.02719C14.6803 2.04234 13.4063 1.5 12 1.5C10.5863 1.5 9.30799 2.03906 8.40002 3.01781C7.48221 4.00734 7.03502 5.35219 7.14002 6.80437C7.34815 9.66937 9.52831 12 12 12C14.4717 12 16.6481 9.66984 16.8596 6.80531C16.966 5.36625 16.516 4.02422 15.5925 3.02719ZM20.25 22.5H3.75002C3.53405 22.5028 3.32017 22.4574 3.12394 22.3672C2.92772 22.2769 2.75407 22.1441 2.61565 21.9783C2.31096 21.6141 2.18815 21.1167 2.27909 20.6137C2.67471 18.4191 3.9094 16.5755 5.85002 15.2812C7.57409 14.1323 9.75799 13.5 12 13.5C14.2421 13.5 16.426 14.1328 18.15 15.2812C20.0906 16.575 21.3253 18.4186 21.721 20.6133C21.8119 21.1162 21.6891 21.6136 21.3844 21.9778C21.246 22.1437 21.0724 22.2766 20.8762 22.367C20.6799 22.4573 20.466 22.5028 20.25 22.5Z"
                              fill="#878787"></path>
                          </svg>
                        </span>
                      </div>
                      <div className={`${CustomClass({ component, version, customClass: "select-identity-box-child" })}`}>
                        <button onClick={() => handleSelectIdentity("FEMENINO")} className={`${CustomClass({ component, version, customClass: "select-identity-box-button" })}`} type="button">FEMENINO</button>
                      </div>
                    </div>
                  </div>
                </>
                :

                <>
                  <div className={`${CustomClass({ component, version, customClass: "select-identity-box-moment-container" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "select-identity-box-moment-box-1" })}`}>
                      <Spinner />
                    </div>
                    <div className={`${CustomClass({ component, version, customClass: "select-identity-box-moment-box-2" })}`}>
                      <span className={`${CustomClass({ component, version, customClass: "select-identity-box-moment-please" })}`}>Un momento por favor...</span>
                    </div>
                  </div>
                </>

            }

          </div>
        </div>
        , document.body
      )
    }
  </>

}

export default SelectIdentity