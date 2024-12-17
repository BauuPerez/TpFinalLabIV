import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Box, Typography, Button } from '@mui/material';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa los estilos de Carousel

const Carrusel = () => {
  return (
    <Box sx={{ width: '50%', padding: 2 }}>

      
      <Carousel 
        showThumbs={false} 
        infiniteLoop={true} 
        autoPlay={true} 
        interval={3000} 
        dynamicHeight={true}
      >
        <div>
          <img src="https://sanjuantennisclub.com/wp-content/uploads/2020/09/2-2.jpg" alt="Imagen 1" />
        </div>
        <div>
          <img src="https://civideportes.com.co/wp-content/uploads/2020/08/asphalt-tennis-court-5354328_640.jpg" alt="Imagen 2" />
        </div>
        <div>
          <img src="https://sxlighting.com/wp-content/uploads/2021/10/Iluminacao-Quadras-de-Tenis.jpg" alt="Imagen 3" />
        </div>
      </Carousel>
    </Box>
  );
};

export default Carrusel;
