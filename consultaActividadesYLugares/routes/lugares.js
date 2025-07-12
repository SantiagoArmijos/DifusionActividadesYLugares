const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/actividades.db');

// GET /api/listarLugares?fechaDesde=YYYY-MM-DD&fechaHasta=YYYY-MM-DD
router.get('/listarLugares', (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    if (!fechaDesde || !fechaHasta) {
        return res.status(400).json({ error: 'Debe proporcionar fechaDesde y fechaHasta en formato (YYYY-MM-DD).' });
    }

    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    if (isNaN(desde) || isNaN(hasta)) {
        return res.status(400).json({ error: 'Fechas inválidas.' });
    }

    const query = `
        SELECT DISTINCT 
            l.idLugar, l.nombre, l.latitud, l.longitud, l.informacion
        FROM Lugar l
        JOIN Actividad a ON l.idLugar = a.idLugar
        WHERE DATE(a.fechaInicio) >= DATE(?) AND DATE(a.fechaFin) <= DATE(?)
    `;

    db.all(query, [fechaDesde, fechaHasta], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar lugares.' });
        }

        res.json(rows);
    });
});

module.exports = router;
