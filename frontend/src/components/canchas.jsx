import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/api";

// Estilos personalizados
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${TableCell.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Canchas = () => {
  const [canchas, setCanchas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [techada, setTechada] = useState(null);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCanchas = async () => {
    try {
      const response = await api.get("/canchas/");
      setCanchas(response.data);
    } catch (error) {
      console.error("Error al obtener las canchas:", error);
    }
  };

  const handleAddCancha = async () => {
    if (!nombre || !id || techada === null) {
      setMessage("Todos los campos son obligatorios");
      setOpen(true);
      return;
    }

    const nuevaCancha = {
      nombre,
      techada,
      id,
    };

    try {
      await api.post("/canchas/", nuevaCancha); // Asumiendo que la API permite crear canchas con POST
      setMessage("Cancha agregada correctamente");
      setOpen(true);
      fetchCanchas(); // Refrescar la lista de canchas
      setNombre("");
      setTechada(null);
      setId("");
    } catch (error) {
      setMessage("Error al agregar la cancha");
      setOpen(true);
      console.error("Error al agregar la cancha:", error);
    }
  };

  useEffect(() => {
    fetchCanchas();
  }, []);

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("https://cdn.pixabay.com/photo/2018/01/07/18/44/sport-3068038_960_720.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      {/* El contenido con transparencia */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(170, 170, 170, 0.85)", // Blanco semi-transparente
          padding: 4,
          boxSizing: "border-box", // Asegura que el padding no genere desbordamiento
          overflowY: "auto",
        }}
      >
        <Button sx={{ marginBottom: 2 }} variant="contained" component={Link} to="/">
          Volver al inicio
        </Button>
        <Typography variant="h4" gutterBottom>
          Gestión de Canchas
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            label="Número de la cancha"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            label="Nombre de la cancha"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormControl>
            <FormLabel>¿Techada?</FormLabel>
            <RadioGroup
              value={techada}
              onChange={(e) => setTechada(e.target.value === "true")}
            >
              <FormControlLabel value="true" control={<Radio />} label="Techada" />
              <FormControlLabel value="false" control={<Radio />} label="No Techada" />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" onClick={handleAddCancha}>
            Agregar
          </Button>
        </Stack>
        <TableContainer component={Paper} sx={{ boxShadow: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>NOMBRE DE LA CANCHA</StyledTableCell>
                <StyledTableCell>TECHADA</StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {canchas.map((cancha) => (
                <StyledTableRow key={cancha.id}>
                  <StyledTableCell>{cancha.nombre}</StyledTableCell>
                  <StyledTableCell>{cancha.techada ? "Techada" : "No Techada"}</StyledTableCell>
                  <StyledTableCell>{cancha.id}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Box>
  );
};

export default Canchas;
