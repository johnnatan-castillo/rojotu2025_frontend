import React from 'react'
import Countdown from '../../components/Countdown'
import CustomClass from '../../utils/CustomClass';

// "2024-07-13T23:59:59"

const component: string = "home";
const version: string = "0";


const Home = () => {
  return (
    <div className={`${CustomClass({ component, version, customClass: "home" })}`}>
      <Countdown targetDate="2024-08-14T18:59:59" />
    </div>
  )
}

export default Home