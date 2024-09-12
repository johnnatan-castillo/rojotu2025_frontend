import React, { lazy, Suspense } from 'react'
import CustomClass from '../../utils/CustomClass';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Spinner from '../../components/Spinner/intex';
import { decryptData } from '../../utils/Decrypt';

const ProductList = lazy(() => import('../../components/ProductList'));

const component: string = "clothes"
const version: string = "0"

const Clothes = () => {

  let userRole: any = useSelector((state: RootState) => state.auth.rol);
  userRole = decryptData(userRole).data;

  if (!userRole) {
    return <div>
      <span>Inicia sesión para ver los productos</span>
    </div>
  }

  return (
    <div className={`${CustomClass({ component, version, customClass: "clothes" })}`}>
      <Suspense fallback={<Spinner />}>
        <ProductList
          itemsPerPage={200}
          showArrows={true}
          showQuickView={true}
          showSizes={true}
          userRole={userRole}
          isFetch={true}
          isPLP={true}
        />
      </Suspense>
    </div>
  )
}

export default Clothes
