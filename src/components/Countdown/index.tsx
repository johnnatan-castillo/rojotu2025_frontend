import React, { useState, useEffect } from 'react';
import CustomClass from '../../utils/CustomClass';

interface CountdownProps {
    targetDate: string;
}


const component: string = "countdown";
const version: string = "0";


const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [calculateTimeLeft]);

    return (
        <div className={`${CustomClass({ component, version, customClass: "countdown" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "countdown-container" })}`}>

                <div className={`${CustomClass({ component, version, customClass: "countdown-box" })} ${CustomClass({ component, version, customClass: "countdown-box-0" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-time" })} ${CustomClass({ component, version, customClass: "countdown-box-1-time" })}`}>
                        {timeLeft.days}
                    </span>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-text" })} ${CustomClass({ component, version, customClass: "countdown-box--1-text" })}`}>Días</span>
                </div>

                <div className={`${CustomClass({ component, version, customClass: "countdown-box" })} ${CustomClass({ component, version, customClass: "countdown-box-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-time" })} ${CustomClass({ component, version, customClass: "countdown-box-1-time" })}`}>
                        {timeLeft.hours}
                    </span>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-text" })} ${CustomClass({ component, version, customClass: "countdown-box--1-text" })}`}>Horas</span>
                </div>

                <div className={`${CustomClass({ component, version, customClass: "countdown-box" })} ${CustomClass({ component, version, customClass: "countdown-box-2" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-time" })} ${CustomClass({ component, version, customClass: "countdown-box-1-time" })}`}>
                        {timeLeft.minutes}
                    </span>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-text" })} ${CustomClass({ component, version, customClass: "countdown-box--1-text" })}`}>Minutos</span>
                </div>

                <div className={`${CustomClass({ component, version, customClass: "countdown-box" })} ${CustomClass({ component, version, customClass: "countdown-box-3" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-time" })} ${CustomClass({ component, version, customClass: "countdown-box-1-time" })}`}>
                        {timeLeft.seconds}
                    </span>
                    <span className={`${CustomClass({ component, version, customClass: "countdown-box-text" })} ${CustomClass({ component, version, customClass: "countdown-box--1-text" })}`}>Segundos</span>
                </div>

            </div>
        </div>
    );
};

export default Countdown;
