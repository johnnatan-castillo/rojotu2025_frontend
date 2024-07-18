import React, { lazy, Suspense } from 'react'
import CustomClass from '../../utils/CustomClass';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Spinner from '../../components/Spinner/intex';

const ProductList = lazy(() => import('../../components/ProductList'));

const component: string = "clothes"
const version: string = "0"

const Clothes = () => {

  const userRole = useSelector((state: RootState) => state.auth.rol);

  if (!userRole) {
    return <div>
      <span>Inicia sesión para ver los productos</span>
    </div>
  }

  return (
    <div className={`${CustomClass({ component, version, customClass: "clothes" })}`}>
      <Suspense fallback={<Spinner />}>
        <ProductList
          itemsPerPage={16}
          showArrows={true}
          showQuickView={true}
          showSizes={true}
          userRole={userRole}
          isFetch={true}
        />
      </Suspense>
    </div>
  )
}

export default Clothes
