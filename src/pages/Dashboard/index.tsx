import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { getApuUrl } from '../../utils/config';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);


const Dashboard = () => {

  const userRole = useSelector((state: RootState) => state.auth);
  const [usersPerDay, setUsersPerDay] = useState([]);
  const [reportBig, setReportBig] = useState({})

  const [dataFilterBy, setDataFilterBy] = useState({})

  const [countrySelect, setCountrySelect] = useState("");
  const [citySelect, setCitySelect] = useState("");


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
        console.log(result);


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
        console.log(result);


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
      const filteredData = Object.keys(reportBig).filter((item: any) => item === countrySelect);
      setDataFilterBy(filteredData);
    }


  }, [countrySelect, reportBig])

  // Filtrar reporte por ciudad
  useEffect(() => {


    if (citySelect) {
      const filteredData = Object.keys(dataFilterBy).filter((item: any) => item === citySelect);
      setDataFilterBy(filteredData);
    }


  }, [citySelect, dataFilterBy])

  return (
    <div>
      <div>
        <div>
          <div>
            <span>Filtro por pedidos</span>
          </div>
          <div>
            <select onChange={(e) => { setCountrySelect(e.target.value) }}>
              <option selected value="" disabled >Seleccione una sucursal</option>
              {
                Object.keys(reportBig).map(country => (<option value={country}>{country}</option>))
              }
            </select>
          </div>
        </div>
        <div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
