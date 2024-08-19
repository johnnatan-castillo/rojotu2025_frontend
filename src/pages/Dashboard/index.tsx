import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { getApuUrl } from '../../utils/config';
import CustomClass from '../../utils/CustomClass';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const component: string = "dasboard"
const version: string = "0"


const Dashboard = () => {

  const userRole = useSelector((state: RootState) => state.auth);
  const [usersPerDay, setUsersPerDay] = useState<any>([]);
  const [reportBig, setReportBig] = useState<any>({});

  const [dataFilterByCountry, setDataFilterByCountry] = useState<any>({})
  const [dataFilterByCity, setDataFilterByCity] = useState<any>({})

  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");


  const handleRemove = () => {
    setCountrySelect("");
    setCitySelect("");

  }

  // Usuarios por dia
  useEffect(() => {

    const url = getApuUrl("/reports/user/day");

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'token': userRole.token
      }
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.code === 200) {
          setUsersPerDay(result.data)
        }

      })
      .catch((error) => {
        console.error(error)
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reporte de usuarios por localizacion
  useEffect(() => {

    const url = getApuUrl("/reports/user");

    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'token': userRole.token
      }
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {

        if (result.code === 200) {
          setReportBig(result.data)
        }

      })
      .catch((error) => {
        console.error(error)
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtrar reporte por país
  useEffect(() => {

    if (countrySelect) {
      const filteredData = Object.keys(reportBig.result).find((item: any) => item === countrySelect && item);
      if (filteredData) {
        setDataFilterByCountry(reportBig.result[filteredData]);
      }
    }


  }, [countrySelect, reportBig])

  // Filtrar reporte por ciudad
  useEffect(() => {


    if (citySelect) {
      const filteredData = Object.keys(dataFilterByCountry).find((item: any) => item === citySelect);
      if (filteredData) {
        setDataFilterByCity({ ...dataFilterByCountry[filteredData], country: countrySelect, city: citySelect });
      }

    }


  }, [citySelect, countrySelect, dataFilterByCountry]);

  return (
    <div className={`${CustomClass({ component, version, customClass: "dasboard" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "dasboard-box-1" })}`}>

        <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global-container" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-span-value" })}`}>{usersPerDay?.total}</span>
          </div>
          <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-title" })}`}>Total de inicios de sesión</span>
        </div>

        <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global-container" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-span-value" })}`}>{reportBig.carritos_enviados_totales}</span>
          </div>
          <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-title" })}`}>Pedidos enviados</span>
        </div>

        <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "dasboard-status-global-container" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-span-value" })}`}>{reportBig.carritos_no_enviados_totales}</span>
          </div>
          <span className={`${CustomClass({ component, version, customClass: "dasboard-status-global-title" })}`}>Pedidos no enviados</span>
        </div>

      </div>
      <div className={`${CustomClass({ component, version, customClass: "dasboard-box-2" })}`}>
        <div className={`${CustomClass({ component, version, customClass: "dasboard-chart-line-title" })}`}>
          <span className={`${CustomClass({ component, version, customClass: "dasboard-chart-line-span" })}`}>Metrica de inicio de sesion por día</span>
        </div>
        <div className={`${CustomClass({ component, version, customClass: "dasboard-chart-line" })}`}>
          <ListChart data={usersPerDay?.detalle} />
        </div>
      </div>
      <div className={`${CustomClass({ component, version, customClass: "dasboard-box-3" })}`}>

        <div className={`${CustomClass({ component, version, customClass: "dasboard-filters-box" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "dasboard-filters" })} ${CustomClass({ component, version, customClass: "dasboard-filters-country" })}`}>

            {
              reportBig?.result && <select
                value={countrySelect}
                className={`${CustomClass({ component, version, customClass: "dasboard-filters-select" })}`}
                onChange={(e) => {
                  setCountrySelect(e.target.value);
                }}
              >
                <option value="" disabled>
                  Seleccione un país
                </option>
                {Object.keys(reportBig?.result).map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            }



          </div>

          <div className={`${CustomClass({ component, version, customClass: "dasboard-filters" })} ${CustomClass({ component, version, customClass: "dasboard-filters-city" })}`}>
            <select value={citySelect} className={`${CustomClass({ component, version, customClass: "dasboard-filters-select" })}`} onChange={(e) => { setCitySelect(e.target.value) }}>
              <option selected value="" disabled >Seleccione una sucursal</option>
              {
                countrySelect &&
                Object.keys(reportBig.result).map((country) => {
                  return Object.keys(reportBig.result[country]).map((city, index) => (
                    <option key={`${country}-${index}`} value={city}>
                      {city}
                    </option>
                  ));
                })
              }

            </select>
          </div>

          <div className={`${CustomClass({ component, version, customClass: "dasboard-filters-buttons" })}`}>
            <button onClick={() => handleRemove()} className={`${CustomClass({ component, version, customClass: "dasboard-filters-buttons-remove" })}`} type="button">Borrar filtros</button>
          </div>

        </div>

      </div>
      <div className={`${CustomClass({ component, version, customClass: "dasboard-box-4" })}`}>

        {reportBig.result && citySelect && <ItemsPerSurcursal sucursal={dataFilterByCity} />}

        {reportBig.result && !citySelect && <Table itemsPerPage={16} products={reportBig.result} />}

      </div>
    </div>
  );
};


interface TableI {
  products: any,
  itemsPerPage: number;
}

const Table: React.FC<TableI> = ({ products, itemsPerPage }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [sucursales, setSucursales] = useState<{ country: string, city: string, data: any }[]>([])

  const totalPages = useMemo(() => {
    return Math.ceil(sucursales.length / itemsPerPage);
  }, [sucursales.length, itemsPerPage]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);


  const displayedProducts = useMemo(() => {

    return sucursales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, sucursales]);

  useEffect(() => {

    let sucursalesFormat: { country: string, city: string, data: any }[] = []

    // eslint-disable-next-line array-callback-return
    Object.keys(products).map((country: any) => {
      // eslint-disable-next-line array-callback-return
      Object.keys(products[country]).map((city: any) => {

        sucursalesFormat.push({
          country,
          city,
          data: products[country][city]
        });

      })

    });


    setSucursales(sucursalesFormat)

  }, [products]);


  return <div className={`${CustomClass({ component, version, customClass: "table-container" })}`}>

    <div className={`${CustomClass({ component, version, customClass: "table-pagination" })}`}>
      {currentPage !== 1 && <button className={`${CustomClass({ component, version, customClass: "table-pagination-prev" })}`} onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>}
      {totalPages > 1 && currentPage !== totalPages && <button className={`${CustomClass({ component, version, customClass: "table-pagination-next" })}`} onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>}
    </div>

    <div className={`${CustomClass({ component, version, customClass: "table-box" })}`}>
      {
        displayedProducts.map((sucursal, index) => (
          <div key={index} className={`${CustomClass({ component, version, customClass: "table-card" })} ${CustomClass({ component, version, customClass: `table-card-${index}` })}`}>
            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.data.totals.carritos_enviados}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>Enviados</span>
            </div>
            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.data.totals.carritos_no_enviados}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>No enviados</span>
            </div>

            {/* <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.totals.nro_ingresos}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>Ingresos</span>
            </div>
            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.totals.usuarios_no_loggeados}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>No logueados</span>
            </div> */}

            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })}`}>{sucursal.city}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })}`}>{sucursal.country}</span>
            </div>
          </div>
        ))
      }

    </div>
  </div>
}

interface ItemsPerSurcursalI {
  sucursal: {
    carritos: any
    ingresos: []
    totals: any
    country: string
    city: string
  }
}

const ItemsPerSurcursal: React.FC<ItemsPerSurcursalI> = ({ sucursal }) => {

  if (Object.keys(sucursal).length === 0) {
    return <></>
  }

  return <div className={`${CustomClass({ component, version, customClass: "table-container" })} ${CustomClass({ component, version, customClass: "table-container-items-per-surcursal" })}`}>

    <div className={`${CustomClass({ component, version, customClass: "table-box" })} ${CustomClass({ component, version, customClass: "table-box-1" })}`}>
      <div className={`${CustomClass({ component, version, customClass: "table-card" })} ${CustomClass({ component, version, customClass: "table-card-items-per-surcursal" })} ${CustomClass({ component, version, customClass: `table-card-information-items-per-surcursal` })}`}>

        <div className={`${CustomClass({ component, version, customClass: "table-card-body-box" })} ${CustomClass({ component, version, customClass: "table-card-body-box-1" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.totals.carritos_enviados}</span>
            <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>Enviados</span>
          </div>
          <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })}`}>{sucursal.totals.carritos_no_enviados}</span>
            <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })}`}>No enviados</span>
          </div>
        </div>

        <div className={`${CustomClass({ component, version, customClass: "table-card-body-box" })} ${CustomClass({ component, version, customClass: "table-card-body-box-2" })}`}>
          <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })}`}>{sucursal.country}</span>
          </div>
          <div className={`${CustomClass({ component, version, customClass: "table-card-body" })}`}>
            <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })}`}>{sucursal.city}</span>
          </div>
        </div>

      </div>
    </div>

    <div className={`${CustomClass({ component, version, customClass: "table-box" })} ${CustomClass({ component, version, customClass: "table-box-2" })}`}>

      {
        Object.keys(sucursal.carritos).map((item: string, index) => (
          <div key={index}>
            <div className={`${CustomClass({ component, version, customClass: "table-card" })} ${CustomClass({ component, version, customClass: "table-card-items-per-surcursal" })} ${CustomClass({ component, version, customClass: `table-card-${index}` })}`}>
              <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })} ${CustomClass({ component, version, customClass: "table-card-body-value-items-per-surcursal" })}`}>{sucursal.carritos[item].carritos_enviados}</span>
              </div>
              <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>{item}</span>
                <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>Pedidos enviados</span>

              </div>
            </div>

            <div className={`${CustomClass({ component, version, customClass: "table-card" })} ${CustomClass({ component, version, customClass: "table-card-items-per-surcursal" })} ${CustomClass({ component, version, customClass: `table-card-${index}` })}`}>
              <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })} ${CustomClass({ component, version, customClass: "table-card-body-value-items-per-surcursal" })}`}>{sucursal.carritos[item].carritos_no_enviados}</span>
              </div>
              <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
                <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>{item}</span>
                <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>Pedidos no enviados</span>

              </div>
            </div>
          </div>
        ))
      }

    </div>

    <div className={`${CustomClass({ component, version, customClass: "table-box" })} ${CustomClass({ component, version, customClass: "table-box-2" })}`}>

      {
        sucursal.ingresos.map((item: any, index) => (
          <div className={`${CustomClass({ component, version, customClass: "table-card" })} ${CustomClass({ component, version, customClass: "table-card-items-per-surcursal" })} ${CustomClass({ component, version, customClass: `table-card-${index}` })}`}>
            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-value" })} ${CustomClass({ component, version, customClass: "table-card-body-value-items-per-surcursal" })}`}>{item.cantidad}</span>
            </div>
            <div className={`${CustomClass({ component, version, customClass: "table-card-body" })} ${CustomClass({ component, version, customClass: "table-card-body-items-per-surcursal" })}`}>
              <span className={`${CustomClass({ component, version, customClass: "table-card-body-information" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>{item.genero}</span>
              <span className={`${CustomClass({ component, version, customClass: "table-card-bosy-title" })} ${CustomClass({ component, version, customClass: "table-card-body-information-items-per-surcursal" })}`}>{item.ingreso === true ? "Han ingresado" : "No han ingresado"}</span>
            </div>
          </div>
        ))
      }

    </div>

  </div>
}


interface DataPoint {
  fecha: string;
  count: number;
  sucursal: string;
  genero: string;
}
interface LineChartComponentProps {
  data: DataPoint[];
}

const ListChart: React.FC<LineChartComponentProps> = ({ data }) => {

  if (!data) {
    return <></>
  }

  // Formatear la fecha a "MMM DD"
  const formattedData = data.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: '2-digit' })
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#E31A2A" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Dashboard;
