const express = require('express');
const app = express();
const actividadesRouter = require('./routes/actividades');
const lugaresRouter = require('./routes/lugares');
const reservaRouter = require('./routes/reservas');
const pagosRouter = require('./routes/pagos');

app.use(express.json());

// Rutas
app.use('/api', actividadesRouter);
app.use('/api', lugaresRouter);
app.use('/api', reservaRouter);
app.use('/api', pagosRouter);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
