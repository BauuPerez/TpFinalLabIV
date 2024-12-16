import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import Canchas from './components/canchas';
import Reservas from './components/reservas';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    backround: {
      default: "#ffffff",
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {<Route path="/reservas" element={<Reservas />} />}
        <Route path="/canchas" element={<Canchas/>}/>
      </Routes>
    </ThemeProvider>   
  );
};

export default App;

