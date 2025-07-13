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

app.use('/api', actividadesRouter);
app.use('/api', lugaresRouter);
app.use('/api', reservasRouter);
app.use('/api', pagosRouter);
app.use('/api', informacionReservaRouter);
app.use('/api', confirmarreservaRouter);

// Puerto y escucha global
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
