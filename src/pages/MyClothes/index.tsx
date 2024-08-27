import React, { lazy, Suspense, useEffect, useState } from 'react'
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
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {

    if (items.length > 0) {
      setProductsList(Array.from(new Set(items.map(product => product.id)))
        .map(id => items.find(product => product.id === id) as Product))
    }else{
      setProductsList([])
    }
  }, [items])


  if (!userRole) {
    return <div>
      <span>Inicia sesión para ver los productos</span>
    </div>
  }

  return (
    <div className={`${CustomClass({ component, version, customClass: "my-clothes" })}`}>
      <Suspense fallback={<Spinner />}>
        <ProductList
          itemsPerPage={200}
          showArrows={true}
          showQuickView={true}
          showSizes={true}
          userRole={userRole}
          isFetch={false}
          productsList={productsList}
          isPLP={false}
        />
      </Suspense>
    </div>
  )
}

export default MyClothes