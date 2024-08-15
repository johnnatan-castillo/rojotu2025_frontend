import React, { Suspense, lazy, useEffect, useState } from 'react';
import CustomClass from '../../utils/CustomClass';
import Spinner from '../../components/Spinner/intex';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Slider = lazy(() => import('../../components/Slider'));
// const Galery = lazy(() => import('../../components/Galery'));

const component: string = "collection";
const version: string = "0";

const Collection = () => {

  const userRole = useSelector((state: RootState) => state.auth.rol);

  const [slidesPerView, setSlidesPerView] = useState(0);

  useEffect(() => {
    
    setSlidesPerView(window.innerWidth <= 600? 2 : 5);
  
  }, [])


  if (!userRole) {
    return <div>
      <span>Inicia sesión para ver los productos</span>
    </div>
  }


 
  

  return (
    <div className={`${CustomClass({ component, version, customClass: "collection" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "collection-container" })}`}>
        <div className={`${CustomClass({ component, version, customClass: "collection-box" })}`}>
          <Suspense fallback={<Spinner />}>
            {/* <Galery /> */}
            <Slider direction='horizontal' slidesPerView={slidesPerView} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Collection;
