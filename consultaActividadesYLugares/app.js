const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const actividadesRouter = require('./routes/actividades');
const lugaresRouter = require('./routes/lugares');
const reservasRouter = require('./routes/reservas');
const pagosRouter = require('./routes/pagos');
const informacionReservaRouter = require('./routes/informacionReserva');
const confirmarreservaRouter = require('./routes/confirmarReserva');
const listarTodasLasActividadesRouter = require('./routes/listar_actividades');
const insertarActividadRouter = require('./routes/insertarActividad');
const listarLugaresRouter = require('./routes/listar_lugares');

app.use('/api', actividadesRouter);
app.use('/api', lugaresRouter);
app.use('/api', reservasRouter);
app.use('/api', pagosRouter);
app.use('/api', informacionReservaRouter);
app.use('/api', confirmarreservaRouter);
app.use('/api', listarTodasLasActividadesRouter);
app.use('/api', insertarActividadRouter);
app.use('/api', listarLugaresRouter);

// Puerto y escucha global
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
