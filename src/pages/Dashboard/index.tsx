import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { CssBaseline, Container } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);


const Dashboard = () => {

  const loginsPerDay = [5, 10, 8, 6, 12, 7, 14]; // Example data
  const frontEndUsers = 20;
  const backEndUsers = 15;
  const maleUsers = 18;
  const femaleUsers = 17;
  const ordersSent = 25;
  const ordersPending = 5;

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const loginsData = {
    labels: months,
    datasets: [
      {
        label: 'Inicio de sesion por dia',
        data: loginsPerDay,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const profileData = {
    labels: ['Usuarios front', 'Usuarios back'],
    datasets: [
      {
        data: [frontEndUsers, backEndUsers],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const ordersData = {
    labels: ['Pedidos enviados', 'Pedidos sin enviar'],
    datasets: [
      {
        data: [ordersSent, ordersPending],
        backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)'],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 205, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: ['Generos'],
    datasets: [
      {
        label: 'Hombres',
        data: [maleUsers],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
      {
        label: 'Mujeres',
        data: [femaleUsers],
        backgroundColor: ['rgba(255, 205, 86, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Metricas
        </Typography>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Inicio de sesión por día
                </Typography>
                <Line data={loginsData} />
                <Typography variant="body1">
                  Total de inicios de sesión: {loginsPerDay.reduce((a, b) => a + b, 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Usuarios por rol
                </Typography>
                <Doughnut data={profileData} />
                <Typography variant="body1">
                  Total de usuarios front: {frontEndUsers}
                </Typography>
                <Typography variant="body1">
                  Total de usuarios back: {backEndUsers}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Pedidos
                </Typography>
                <Doughnut data={ordersData} />
                <Typography variant="body1">
                  Total de pedidos enviados: {ordersSent}
                </Typography>
                <Typography variant="body1">
                  Total de pedidos sin enviar: {ordersPending}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Géneros
                </Typography>
                <Bar data={genderData} />
                <Typography variant="body1">
                  Total de usuarios hombres: {maleUsers}
                </Typography>
                <Typography variant="body1">
                  Total de usuarios mujeres: {femaleUsers}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
