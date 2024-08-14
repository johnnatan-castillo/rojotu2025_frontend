import React from 'react'
import CustomClass from '../../utils/CustomClass'

import VIDEOMASCULINO from "../../assets/videos/desk-guia-de-tallas-hombre.mp4"
import VIDEOFEMENINO from "../../assets/videos/desk-guia-de-tallas-mujer.mp4"

import 'plyr/dist/plyr.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const component: string = "size-guide"
const version: string = "0"


const SizeGuide = () => {

  const { gender } = useSelector((state: RootState) => state.auth);

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
              <video autoPlay={true} loop={true} playsInline={true} muted className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide-video" })}`} controls>
              <source src={VIDEOFEMENINO} type="video/mp4" />
              
              Tu navegador no soporta el elemento de video.
            </video>
            }

{
              gender === "MASCULINO" &&
              <video autoPlay={true} loop={true} playsInline={true} muted className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide-video" })}`} controls>
              <source src={VIDEOMASCULINO} type="video/mp4" />
              
              Tu navegador no soporta el elemento de video.
            </video>
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide