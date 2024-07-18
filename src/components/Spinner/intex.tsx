import React from 'react'
import CustomClass from '../../utils/CustomClass'


const component: string = "spinner"
const version: string = "0"

const Spinner = () => {
  return (
    <div className={`${CustomClass({ component, version, customClass: "spinner" })}`}>
      <span className="loader"></span>
    </div>
  )
}

export default Spinner