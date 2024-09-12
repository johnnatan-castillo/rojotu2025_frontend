import React from 'react'
import CustomClass from '../../utils/CustomClass'

import VIDEOMASCULINO from "../../assets/videos/desk-guia-de-tallas-hombre.mp4"
import VIDEOFEMENINO from "../../assets/videos/desk-guia-de-tallas-mujer.mp4"

// Guia de tallas
import WOMANGUIDE_1 from "../../assets/side-guide/MUJER.png"

import MENGUIDE_1 from "../../assets/side-guide/HOMBRE-1.png"
import MENGUIDE_2 from "../../assets/side-guide/HOMBRE-2.png"
// Guia de tallas

import 'plyr/dist/plyr.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { decryptData } from '../../utils/Decrypt'

const component: string = "size-guide"
const version: string = "0"


const SizeGuide = () => {

  let { gender }: any = useSelector((state: RootState) => state.auth);

  gender = decryptData(gender).data

  return (
    <div className={`${CustomClass({ component, version, customClass: "size-guide" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "size-guide-container" })}`}>
        <div className={`${CustomClass({ component, version, customClass: "size-guide-box-1" })}`}>
          <span className={`${CustomClass({ component, version, customClass: "size-guide-box-1-gender" })}`}>{ }</span>
          <span className={`${CustomClass({ component, version, customClass: "size-guide-box-1-gender" })}`}>{ }</span>
        </div>
        <div className={`${CustomClass({ component, version, customClass: "size-guide-box-2" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide" })}`}>

            {
              gender === "FEMENINO" &&
              <>
                <video autoPlay={true} loop={true} playsInline={true} muted className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide-video" })}`} controls>
                  <source src={VIDEOFEMENINO} type="video/mp4" />

                  Tu navegador no soporta el elemento de video.
                </video>

                <img className={`${CustomClass({ component, version, customClass: "img-size-guide" })}`} src={WOMANGUIDE_1} alt="guia de tallas" />
              </>
            }

            {
              gender === "MASCULINO" &&
              <>
                <video autoPlay={true} loop={true} playsInline={true} muted className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide-video" })}`} controls>
                  <source src={VIDEOMASCULINO} type="video/mp4" />

                  Tu navegador no soporta el elemento de video.
                </video>

                <img className={`${CustomClass({ component, version, customClass: "img-size-guide" })}`} src={MENGUIDE_1} alt="guia de tallas" />
                <img className={`${CustomClass({ component, version, customClass: "img-size-guide" })}`} src={MENGUIDE_2} alt="guia de tallas" />
              </>
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide