/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Countdown from '../../components/Countdown'
import CustomClass from '../../utils/CustomClass';
import BANERHOME from "../../assets/home-ecard.png"

import NAV1 from "../../assets/nav-1 1.jpg"
import NAV2 from "../../assets/nav-2 1.png"
import NAV3 from "../../assets/nav-3 1.jpg"
import { useNavigate } from 'react-router-dom';


// "2024-07-13T23:59:59"

const component: string = "home";
const version: string = "0";


const Home = () => {

  const navigate = useNavigate();

  return (
    <div className={`${CustomClass({ component, version, customClass: "home" })}`}>
      <Countdown targetDate="2024-09-19T00:00:00" />
      <div className={`${CustomClass({ component, version, customClass: "baner-container" })}`}>
        <img className={`${CustomClass({ component, version, customClass: "baner-image" })}`} src={BANERHOME} alt="image con tres personas" />
      </div>

      <div className={`${CustomClass({ component, version, customClass: "home-split-navigation-container" })}`}>

        {/* Primer bloque */}
        <div className={`${CustomClass({ component, version, customClass: "home-split-navigation" })} ${CustomClass({ component, version, customClass: "home-split-navigation-1" })}`}>

          <div className={`${CustomClass({ component, version, customClass: "home-image-navigation-container" })}`}>
            <img className={`${CustomClass({ component, version, customClass: "home-image-navigation" })}`} src={NAV1} alt="" />
          </div>

          <span className={`${CustomClass({ component, version, customClass: "home-image-title" })}`}>Lookbook</span>

          <p className={`${CustomClass({ component, version, customClass: "home-image-paragraph" })}`}>Conoce la <strong>programación de nuestra Colección RojoTú 2025 para el Front</strong> así como los <strong>outfits destacados para el Back</strong> haciendo <a className={`${CustomClass({ component, version, customClass: "home-image-link" })}`} onClick={() => { navigate("/collection") }} href="#" target='_self' rel='noreferrer'>click aquí.</a></p>

        </div>

        {/* Segundo bloque */}
        <div className={`${CustomClass({ component, version, customClass: "home-split-navigation" })} ${CustomClass({ component, version, customClass: "home-split-navigation-2" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "home-image-navigation-container" })}`}>
            <img className={`${CustomClass({ component, version, customClass: "home-image-navigation" })}`} src={NAV2} alt="" />
          </div>

          <span className={`${CustomClass({ component, version, customClass: "home-image-title" })}`}>Tallaje</span>

          <p className={`${CustomClass({ component, version, customClass: "home-image-paragraph" })}`}>Nos hemos transformado, por eso te invitamos a consultar <strong>la nueva guía de tallas</strong> para seleccionar adecuadamente tus prendas, <a className={`${CustomClass({ component, version, customClass: "home-image-link" })}`} onClick={() => { navigate("/size-guide") }} href="#" target='_self' rel='noreferrer'>haz click aquí.</a></p>
        </div>

        {/* Tercer bloque */}
        <div className={`${CustomClass({ component, version, customClass: "home-split-navigation" })} ${CustomClass({ component, version, customClass: "home-split-navigation-3" })}`}>

          <div className={`${CustomClass({ component, version, customClass: "home-image-navigation-container" })}`}>
            <img className={`${CustomClass({ component, version, customClass: "home-image-navigation" })}`} src={NAV3} alt="" />
          </div>

          <span className={`${CustomClass({ component, version, customClass: "home-image-title" })}`}>Selección de prenda</span>

          <p className={`${CustomClass({ component, version, customClass: "home-image-paragraph" })}`}>Conoce <a className={`${CustomClass({ component, version, customClass: "home-image-link" })}`} onClick={() => { navigate("/clothes") }} href="#" target='_self' rel='noreferrer'>aquí </a> las <strong>prendas de la colección 2025</strong> y selecciona tus outfits.</p>

        </div>

      </div>
    </div>
  )
}

export default Home