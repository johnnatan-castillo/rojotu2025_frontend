import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CustomClass from '../../utils/CustomClass';
import { decryptData } from '../../utils/Decrypt';
import Spinner from '../../components/Spinner/intex';


const component: string = "3d"
const version: string = "0"

const ThreeD = () => {


    const userRole = useSelector((state: RootState) => state.auth.rol);
    const { gender, climate, url_3d } = useSelector((state: RootState) => state.auth);

    if (!userRole) {
        return <div>
            <span>Inicia sesión para ver los productos</span>
        </div>
    }


    return (
        <div className={`${CustomClass({ component, version, customClass: "3d" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "3d-container" })}`}>
                <div className={`${CustomClass({ component, version, customClass: "3d-box-1" })}`}>
                    <span className={`${CustomClass({ component, version, customClass: "3d-box-1-gender" })}`}>{gender}</span>
                    <span className={`${CustomClass({ component, version, customClass: "3d-box-1-gender" })}`}>{climate}</span>
                </div>
                <div className={`${CustomClass({ component, version, customClass: "3d-box-2" })}`}>
                    <div className={`${CustomClass({ component, version, customClass: "3d-box-2-web-3d" })}`}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <LazyIframe url={url_3d} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const LazyIframe: React.FC<{ url: string }> = ({ url }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '80%' }}>
            {isLoading && <Spinner />}
            <iframe
                title="3d"
                src={decryptData(url).data}
                style={{
                    width: '100%',
                    height: '100%',
                    display: isLoading ? 'none' : 'block'
                }}
                onLoad={handleIframeLoad}
            />
        </div>
    );
};

export default ThreeD