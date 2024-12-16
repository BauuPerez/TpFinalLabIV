import React, { useState, useEffect } from "react";
import {
  Container,
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
  const [open, setOpen] = useState(false); // Snackbar para campos obligatorios
  const [successOpen, setSuccessOpen] = useState(false); // Snackbar para éxito
  const [duplicateOpen, setDuplicateOpen] = useState(false); // Snackbar para ID duplicado
  const [invalidNumberOpen, setInvalidNumberOpen] = useState(false); // Snackbar para entrada no numérica

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setSuccessOpen(false);
    setDuplicateOpen(false);
    setInvalidNumberOpen(false);
  };

  const fetchCanchas = async () => {
    try {
      const response = await api.get("/canchas/");
      setCanchas(response.data);
      console.log("Canchas obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener las canchas:", error);
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value;

    // Permite solo números
    if (/^\d*$/.test(value)) {
      setId(value);
    } else {
      setInvalidNumberOpen(true); // Muestra el Snackbar para entrada no numérica
    }
  };

  const addCancha = async () => {
    if (!nombre || !id || techada === null) {
      setOpen(true); // Muestra el Snackbar de campos obligatorios
      return;
    }

    // Verifica si el ID ya existe
    const canchaExistente = canchas.find((cancha) => cancha.id === parseInt(id, 10));
    if (canchaExistente) {
      setDuplicateOpen(true); // Muestra el Snackbar de cancha duplicada
      return;
    }

    try {
      const data = {
        id: parseInt(id, 10), // Convierte `id` a número para evitar errores de tipo
        nombre,
        techada,
      };

      console.log("Datos enviados:", data);
      const response = await api.post("/canchas/", data);
      setCanchas([...canchas, response.data.cancha]); // Actualiza la lista de canchas
      setNombre("");
      setId("");
      setTechada(null);

      // Muestra el Snackbar de éxito
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error al agregar una cancha:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCanchas();
  }, []);

  return (
    <Container>
      <Button sx={{ margin: "20px" }} variant="contained" component={Link} to="/">
        Volver al inicio
      </Button>
      <Typography variant="h4" gutterBottom>
        Gestión de Canchas
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField
          label="Número de la cancha"
          value={id}
          onChange={handleIdChange} // Valida la entrada
          sx={{
            "& .MuiInputLabel-root": { color: "black" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
          }}
        />
        <TextField
          label="Nombre de la cancha"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": { color: "black" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
          }}
        />
        <FormControl>
          <FormLabel sx={{ color: "black" }}>¿Techada?</FormLabel>
          <RadioGroup
            value={techada}
            onChange={(e) => setTechada(e.target.value === "true")} // Convierte el valor a booleano
          >
            <FormControlLabel value="true" control={<Radio />} label="Techada" />
            <FormControlLabel value="false" control={<Radio />} label="No Techada" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" onClick={addCancha}>
          Agregar
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nombre de la cancha</StyledTableCell>
              <StyledTableCell>Techada</StyledTableCell>
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
      {/* Snackbar para campos obligatorios */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Todos los campos son obligatorios."
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      {/* Snackbar para éxito */}
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="¡Cancha agregada exitosamente!"
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      {/* Snackbar para entrada no numérica */}
      <Snackbar
        open={invalidNumberOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Solo se permiten números en el campo 'Número de la cancha'."
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      {/* Snackbar para ID duplicado */}
      <Snackbar
        open={duplicateOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Esta cancha ya fue registrada."
        action={
          <IconButton size="small" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default Canchas;
