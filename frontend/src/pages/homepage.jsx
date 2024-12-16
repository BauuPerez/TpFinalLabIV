import React from 'react';
import { Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Reservas de Canchas</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" component={Link} to="/reservas">Ver Reservas</Button>
        <Button variant="contained" component={Link} to="/canchas">Ver Canchas</Button>
      </Stack>
    </Container>
  );
};

export default HomePage;
