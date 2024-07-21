import React from 'react'
import CustomClass from '../../utils/CustomClass'

import VIDEO from "../../assets/videos/desk-guia-de-tallas.mp4"
import 'plyr/dist/plyr.css'

const component: string = "size-guide"
const version: string = "0"


const SizeGuide = () => {
  return (
    <div className={`${CustomClass({ component, version, customClass: "size-guide" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "size-guide-container" })}`}>
        <div className={`${CustomClass({ component, version, customClass: "size-guide-box-1" })}`}>
          <span className={`${CustomClass({ component, version, customClass: "size-guide-box-1-gender" })}`}>{ }</span>
          <span className={`${CustomClass({ component, version, customClass: "size-guide-box-1-gender" })}`}>{ }</span>
        </div>
        <div className={`${CustomClass({ component, version, customClass: "size-guide-box-2" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide" })}`}>
            <video autoPlay={true} loop={true} playsInline={true} className={`${CustomClass({ component, version, customClass: "size-guide-box-2-web-size-guide-video" })}`} controls>
              <source src={VIDEO} type="video/mp4" />
              
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide