import React, { useEffect, useRef, useState } from 'react'
import CustomClass from '../../utils/CustomClass';
import ReactDOM from 'react-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { addClothingItemThunk } from '../../features/cart/cartSlice';

import NOFOUNDIMAGE from "../../assets/plp/no-image.jpg"

const component: string = "quickview"
const version: string = "0"

const QuickView: React.FC<QuickViewProps> = ({ product, setproductQuickView }) => {
  const { nombre_prenda, descripcion, tallas, referencia } = product;
  const [selectedSize, setSelectedSize] = useState({
    size: '',
    selectedIntoQuickView: false
  });
  const { prendas_superiores, prendas_inferiores, prendas_otros, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.carts.cart);
  const imageRef: any = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const limits = {
    prendas_superiores: parseInt(prendas_superiores),
    prendas_inferiores: parseInt(prendas_inferiores),
    prendas_otros: parseInt(prendas_otros)
  }

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: any) => {
    if (!isZoomed) return;
    const {
      left,
      top,
      width,
      height
    } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setPosition({ x, y });
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize({
      size,
      selectedIntoQuickView: selectedSize.size ? selectedSize.selectedIntoQuickView ? true : false : true
    });
  };

  const handleHideQuickView = () => {

    setproductQuickView({} as Product); // Limpia el producto cuando se cierra
  };

  const handleAddCart = () => {

    dispatch(addClothingItemThunk({ product, limits, talla: selectedSize.size, token }));
    setSelectedSize((prev) => ({
      ...prev,
      selectedIntoQuickView: false
    }))
  }

  useEffect(() => {

    const existingProduct = items.map(
      (item) => item.referencia === referencia
    );

    if (existingProduct && existingProduct.length > 0) {
      // setSelectedSize({
      //   size: existingProduct.talla,
      //   selectedIntoQuickView: false
      // });
    }

  }, [items, referencia])


  return ReactDOM.createPortal(
    <div className={`${CustomClass({ component, version, customClass: "quickview" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "quickview-container" })}`}>
        {/* Header */}
        <div className={`${CustomClass({ component, version, customClass: "quickview-header" })}`}>
          <button className={`${CustomClass({ component, version, customClass: "quickview-header-botton-exit" })}`} type="button"
            onClick={() => handleHideQuickView()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_12_2)">
                <mask id="mask0_12_2" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <path d="M24 0H0V24H24V0Z" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_12_2)">
                  <path d="M6.40008 18.3068L5.69238 17.5991L11.2924 11.9991L5.69238 6.39911L6.40008 5.69141L12.0001 11.2914L17.6001 5.69141L18.3078 6.39911L12.7078 11.9991L18.3078 17.5991L17.6001 18.3068L12.0001 12.7068L6.40008 18.3068Z" fill="#959393" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_12_2">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </button>
        </div>
        {/* Body */}
        <div className={`${CustomClass({ component, version, customClass: "quickview-body" })}`}>

          {/* Imagen grande */}
          <div onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove} className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-container" })}`}>
            <img ref={imageRef} style={{
              transformOrigin: `${position.x * 100}% ${position.y * 100}%`
            }} className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-big" })} ${isZoomed && CustomClass({ component, version, customClass: "quickview-body-imagen-big-zoomed" })}`} src={product.ubicacion_archivo && product.ubicacion_archivo.endsWith('.jpg') ? product.ubicacion_archivo : NOFOUNDIMAGE} alt={nombre_prenda} />
          </div>

          {/* Imagenes pequeñas */}
          {/* <div className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-small" })}`}> */}
          {/* <> */}

          {/* Imagen 1 */}
          {/* <img className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-small-1" })}`} src={nombre_archivo} alt={nombre_prenda} /> */}
          {/* Imagen 2 */}
          {/* <img className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-small-2" })}`} src={nombre_archivo} alt={nombre_prenda} /> */}
          {/* Imagen 3 */}
          {/* <img className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-small-3" })}`} src={nombre_archivo} alt={nombre_prenda} /> */}
          {/* Imagen 4 */}
          {/* <img className={`${CustomClass({ component, version, customClass: "quickview-body-imagen-small-4" })}`} src={nombre_archivo} alt={nombre_prenda} ></img> */}

          {/* </> */}

          {/* </div> */}

          {/* Información de prenda */}
          <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-name" })}`}>{nombre_prenda}</span>
            <p className={`${CustomClass({ component, version, customClass: "quickview-body-product-specifications-description" })}`}>{descripcion}</p>

            {tallas && <div className={`${CustomClass({ component, version, customClass: "card-footer-product-sizes" })}`}>
              {
                product.tallas.split("-").map((size: string, index: number) => (
                  <button key={index + Math.random()} onClick={() => handleSizeClick(size)}
                    className={`${CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size" })} ${(items.some((item) => item.referencia === product.referencia && size === item.talla) || size === selectedSize.size) && CustomClass({ component: "card", version, customClass: "card-footer-product-sku-size-selected" })}`}
                    type="button"
                  >
                    {size}
                  </button>
                ))
              }
            </div>}

            <div className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-container" })}`}>
              <button onClick={() => handleAddCart()} className={`${CustomClass({ component, version, customClass: "quickview-body-product-buy-button" })}`}>{selectedSize.size ? selectedSize.selectedIntoQuickView ? "Agregar al carrito" : "Actualizar talla" : "Agregar al carrito"}</button>
            </div>
          </div>

        </div>
        {/* Footer */}
        <div className={`${CustomClass({ component, version, customClass: "quickview-footer" })}`}>

        </div>
      </div>
    </div>
    ,
    document.body
  )
}

export default QuickView