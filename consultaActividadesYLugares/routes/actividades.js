const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./db/actividades.db');

// GET /api/listarActividades?fechaInicio=2025-07-01&fechaFin=2025-07-31
router.get('/listarActividades', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Debe proporcionar fechaInicio y fechaFin en formato ISO (YYYY-MM-DD).' });
    }

    // Validar formato de fecha
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
        return res.status(400).json({ error: 'Fechas inválidas.' });
    }

    const query = `
        SELECT 
            a.*, 
            l.nombre AS nombreLugar,
            l.latitud,
            l.longitud,
            l.informacion
        FROM Actividad a
        JOIN Lugar l ON a.idLugar = l.idLugar
        WHERE DATE(a.fechaInicio) >= DATE(?) AND DATE(a.fechaFin) <= DATE(?)
        ORDER BY a.fechaInicio ASC
    `;

    db.all(query, [fechaInicio, fechaFin], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar actividades.' });
        }

        res.json(rows);
    });
});

module.exports = router;
