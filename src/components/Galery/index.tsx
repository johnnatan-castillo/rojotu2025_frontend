/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import CustomClass from '../../utils/CustomClass';
import Badge from './SelectClothe';
import { useFetch } from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import NOFOUNDIMAGE from "../../assets/plp/no-image.jpg"

const component: string = "galery"
const version: string = "0"


const Galery: React.FC = () => {
  const profile = useSelector((state: RootState) => state.auth);

  let currentIndex = 0;


  const [products, setProducts] = useState<LookBook[]>([]);

  const { data, loading, error } = useFetch("/listarlookbooks", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: profile.token
    },
    body: JSON.stringify({})
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setProducts(() => (data));
    }
  }, [data, error, loading]);



  const generateLookbook = () => {
    const lookbookItems: JSX.Element[] = [];

    while (currentIndex < products.length) {
      // Parte izquierda
      const leftItems: JSX.Element[] = [];
      for (let i = 0; i < 1; i++) {
        if (currentIndex >= products.length) break;
        leftItems.push(
          <div style={styles.left} key={`left-${currentIndex}`} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-left-box" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "galery-image-button-quickview-container" })}`}>
              <Badge component={component} version={version} numberButton={1} id={products[currentIndex].referencia_prenda_superior} />
              <Badge component={component} version={version} numberButton={2} id={products[currentIndex].referencia_prenda_inferior} />
              <Badge component={component} version={version} numberButton={3} id={products[currentIndex].referencia_otro} />
              <img style={styles.img} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-left" })}`} src={products[currentIndex].image ? products[currentIndex].image : NOFOUNDIMAGE} alt="Lookbook Image" />
            </div>
          </div>
        );
        currentIndex++;
      }

      // Parte central
      const centerItems: JSX.Element[] = [];
      let centerItemsInto: JSX.Element[] = [];
      for (let i = 0; i < 2; i++) {
        if (currentIndex >= products.length) break;
        for (let i = 0; i < 4; i++) {

          if (currentIndex >= products.length) break;
          centerItemsInto.push(
            <div key={Math.random()} className={`${CustomClass({ component, version, customClass: "galery-image-button-quickview-container" })}`}>
              <Badge component={component} version={version} numberButton={1} id={products[currentIndex].referencia_prenda_superior} />
              <Badge component={component} version={version} numberButton={2} id={products[currentIndex].referencia_prenda_inferior} />
              <Badge component={component} version={version} numberButton={3} id={products[currentIndex].referencia_otro} />

              <img style={styles.img} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-center" })}`} src={products[currentIndex].image ? products[currentIndex].image : NOFOUNDIMAGE} alt="Lookbook Image" />
            </div>
          )

          currentIndex++;
        }


        centerItems.push(
          <div style={styles.center} key={`center-${currentIndex + Math.random()}`} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-center-box" })}`}>
            {centerItemsInto}
          </div>
        );
        centerItemsInto = [];
      }

      // Parte derecha
      const rightItems: JSX.Element[] = [];
      for (let i = 0; i < 1; i++) {
        if (currentIndex >= products.length) break;
        rightItems.push(
          <div style={styles.right} key={`right-${currentIndex}`} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-right-box" })}`}>
            <div className={`${CustomClass({ component, version, customClass: "galery-image-button-quickview-container" })}`}>
              <Badge component={component} version={version} numberButton={1} id={products[currentIndex].referencia_prenda_superior} />
              <Badge component={component} version={version} numberButton={2} id={products[currentIndex].referencia_prenda_inferior} />
              <Badge component={component} version={version} numberButton={3} id={products[currentIndex].referencia_otro} />

              <img style={styles.img} className={`${CustomClass({ component, version, customClass: "galery-image" })} ${CustomClass({ component, version, customClass: "galery-image-right" })}`} src={products[currentIndex].image ? products[currentIndex].image : NOFOUNDIMAGE} alt="Lookbook Image" />
            </div>
          </div>
        );
        currentIndex++;
      }

      lookbookItems.push(
        <React.Fragment key={`fragment-${currentIndex}`}>
          <div style={styles.left} className={`${CustomClass({ component, version, customClass: "galery-container" })} ${CustomClass({ component, version, customClass: "galery-container-left" })}`}>{leftItems}</div>
          <div style={styles.center} className={`${CustomClass({ component, version, customClass: "galery-container" })} ${CustomClass({ component, version, customClass: "galery-container-center" })}`}>{centerItems}</div>
          <div style={styles.right} className={`${CustomClass({ component, version, customClass: "galery-container" })} ${CustomClass({ component, version, customClass: "galery-container-right" })}`}>{rightItems}</div>
        </React.Fragment>
      );
    }

    return lookbookItems;
  };

  return (
    <div style={styles.container} className={`${CustomClass({ component, version, customClass: "galery" })}`}>
      {generateLookbook()}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    padding: '10px',
    maxWidth: '100%',
    width: '100%',
    margin: 0,
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: 'auto',
    display: 'block',
    border: "1px solid #4d4d4d3d",
  },
  left: {
    gridColumn: 'span 2',
    display: 'grid',
    gridTemplateRows: 'repeat(2, auto)',
    columnGap: 0,
    rowGap: 0,
  },
  center: {
    gridColumn: 'span 4',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(3, auto)',
    columnGap: 0,
    rowGap: 0,

  },
  right: {
    gridColumn: 'span 2',
    display: 'grid',
    gridTemplateRows: 'repeat(2, auto)',
    columnGap: 0,
    rowGap: 0,
  },
};

export default Galery;
