import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Grid, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import api from "../services/api";
import Dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Reservas = () => {
  const [fechaFiltro, setFechaFiltro] = useState(null); // Fecha para filtrar reservas
  const [fechaFormulario, setFechaFormulario] = useState(null); // Fecha para el formulario
  const [hora, setHora] = useState('');
  const [duracion, setDuracion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [canchaId, setCanchaId] = useState(''); // Este es el ID de la cancha para la nueva reserva
  const [reservas, setReservas] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reservaToEdit, setReservaToEdit] = useState(null);
  const [filtroCanchaId, setFiltroCanchaId] = useState(''); // Este es el ID de cancha para el filtro

  // Cargar todas las reservas al inicio
  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas/');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleHoraChange = (event) => setHora(event.target.value);
  const handleDuracionChange = (event) => setDuracion(event.target.value);
  const handleTelefonoChange = (event) => setTelefono(event.target.value);
  const handleNombreContactoChange = (event) => setNombreContacto(event.target.value);
  const handleCanchaIdChange = (event) => setCanchaId(event.target.value); // Maneja el ID de cancha para la nueva reserva
  const handleFiltroCanchaIdChange = (event) => setFiltroCanchaId(event.target.value); // Maneja el ID de cancha para el filtro

  // Agregar o modificar reserva
  const handleReservaSubmit = async () => {
    const reservaData = {
      fecha: fechaFormulario?.format('YYYY-MM-DD'),
      hora,
      duracion,
      telefono,
      nombre_contacto: nombreContacto,
      cancha_id: canchaId, // Este es el ID de la cancha de la nueva reserva
    };

    try {
      if (reservaToEdit) {
        await api.put(`/reservas/${reservaToEdit.id}`, reservaData);
        alert('Reserva modificada correctamente');
      } else {
        await api.post('/reservas/', reservaData);
        alert('Reserva creada correctamente');
      }
      setIsDialogOpen(false);
      fetchReservas();
    } catch (error) {
      alert('Hubo un error al guardar la reserva.');
      console.error(error);
    }
  };

  // Eliminar reserva
  const handleDeleteReserva = async (id) => {
    try {
      await api.delete(`/reservas/${id}`);
      alert('Reserva eliminada correctamente');
      fetchReservas();
    } catch (error) {
      alert('Hubo un error al eliminar la reserva.');
      console.error(error);
    }
  };

  // Mostrar formulario para agregar/modificar reserva
  const openDialog = (reserva = null) => {
    if (reserva) {
      setReservaToEdit(reserva);
      setFechaFormulario(Dayjs(reserva.fecha));
      setHora(reserva.hora);
      setDuracion(reserva.duracion);
      setTelefono(reserva.telefono);
      setNombreContacto(reserva.nombre_contacto);
      setCanchaId(reserva.cancha_id); // Cargar el ID de la cancha al editar
    } else {
      setReservaToEdit(null);
      setFechaFormulario(null);
      setHora('');
      setDuracion('');
      setTelefono('');
      setNombreContacto('');
      setCanchaId(''); // Limpiar el ID de la cancha al crear una nueva reserva
    }
    setIsDialogOpen(true);
  };

  const fetchReservasFiltradas = async () => {
    if (!fechaFiltro || !filtroCanchaId) {
      alert("Por favor selecciona una fecha y un ID de cancha.");
      return;
    }

    try {
      const formattedDate = fechaFiltro.format('YYYY-MM-DD');
      const response = await api.get(`/reservas/${filtroCanchaId}/${formattedDate}`);
      setReservas(response.data);
    } catch (error) {
      console.error("Error al filtrar reservas:", error);
      alert("Hubo un error al obtener las reservas filtradas.");
    }
  };

  return (
    <div>
      <Button sx={{ margin: "20px" }} variant="contained" component={Link} to="/">Volver al inicio</Button>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Filtrar Reservas
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <DatePicker
            label="Fecha"
            value={fechaFiltro}
            onChange={(newFecha) => setFechaFiltro(newFecha)}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField
            label="ID de Cancha"
            value={filtroCanchaId}
            onChange={handleFiltroCanchaIdChange}
          />
          <Button variant="contained" color="primary" onClick={fetchReservasFiltradas}>
            Filtrar
          </Button>
        </div>
      </LocalizationProvider>
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Agregar Nueva Reserva
      </Button>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Reservas actuales:
      </Typography>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Fecha</StyledTableCell>
            <StyledTableCell>Hora</StyledTableCell>
            <StyledTableCell>Duración</StyledTableCell>
            <StyledTableCell>Teléfono</StyledTableCell>
            <StyledTableCell>Contacto</StyledTableCell>
            <StyledTableCell>Cancha</StyledTableCell>
            <StyledTableCell>Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <StyledTableRow key={reserva.id}>
                <StyledTableCell>{reserva.fecha}</StyledTableCell>
                <StyledTableCell>{reserva.hora}</StyledTableCell>
                <StyledTableCell>{reserva.duracion}</StyledTableCell>
                <StyledTableCell>{reserva.telefono}</StyledTableCell>
                <StyledTableCell>{reserva.nombre_contacto}</StyledTableCell>
                <StyledTableCell>{reserva.cancha_id}</StyledTableCell>
                <StyledTableCell>
                  <Button variant="outlined" color="primary" onClick={() => openDialog(reserva)}>Editar</Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteReserva(reserva.id)}>Eliminar</Button>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={7} align="center">
                No se encontraron reservas para los criterios seleccionados.
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{reservaToEdit ? 'Modificar Reserva' : 'Agregar Nueva Reserva'}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DatePicker
                  label="Fecha"
                  value={fechaFormulario}
                  onChange={setFechaFormulario}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Hora"
                  type="time"
                  value={hora}
                  onChange={handleHoraChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Duración (horas)"
                  value={duracion}
                  onChange={handleDuracionChange}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Teléfono"
                  value={telefono}
                  onChange={handleTelefonoChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nombre de Contacto"
                  value={nombreContacto}
                  onChange={handleNombreContactoChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ID de Cancha"
                  value={canchaId}
                  onChange={handleCanchaIdChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleReservaSubmit} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Reservas;
