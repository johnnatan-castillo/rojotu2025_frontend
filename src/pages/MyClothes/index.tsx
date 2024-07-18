import React, { lazy, Suspense } from 'react'
import Spinner from '../../components/Spinner/intex'
import CustomClass from '../../utils/CustomClass'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ProductList = lazy(() => import('../../components/ProductList'));

const component: string = "my-clothes"
const version: string = "0"


const MyClothes = () => {


  const userRole = useSelector((state: RootState) => state.auth.rol);
  const { items } = useSelector((state: RootState) => state.carts.cart);

  if (!userRole) {
    return <div>
      <span>Inicia sesión para ver los productos</span>
    </div>
  }

  return (
    <div className={`${CustomClass({ component, version, customClass: "my-clothes" })}`}>
      <Suspense fallback={<Spinner />}>
        <ProductList
          itemsPerPage={16}
          showArrows={true}
          showQuickView={true}
          showSizes={true}
          userRole={userRole}
          isFetch={false}
          productsList={items}
        />
      </Suspense>
    </div>
  )
}

export default MyClothes