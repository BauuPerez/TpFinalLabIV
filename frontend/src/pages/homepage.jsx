import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import Carrusel from '../components/carousel';

const HomePage = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2018/07/22/08/49/tennis-3554019_640.jpg)',
        backgroundSize: 'cover', // Asegura que la imagen cubra toda la pantalla
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
        height: '100vh', // Ocupa el 100% de la altura de la ventana
        width: '100vw', // Ocupa el 100% del ancho de la ventana
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: 0, // Elimina márgenes adicionales
        padding: 0, // Elimina padding adicional
        overflow: 'hidden', // Evita cualquier desbordamiento
      }}
    >
      
      <Typography variant="h4" gutterBottom color="black">Gestión de Reservas de Canchas</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={Link} to="/reservas">Ver Reservas</Button>
        <Button variant="contained" component={Link} to="/canchas">Ver Canchas</Button>
      </Stack>
      <Carrusel />
    </Box>
  );
};

export default HomePage;
