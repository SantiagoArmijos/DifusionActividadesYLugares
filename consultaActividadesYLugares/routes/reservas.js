const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/actividades.db');

// POST /api/reservaActividad
router.post('/reservaActividad', (req, res) => {
    const {
        idReserva,
        idActividad,
        nombreTurista,
        correoTurista,
        cantidadPersonas,
        fechaReserva
    } = req.body;

    if (!idReserva || !idActividad || !nombreTurista || !correoTurista || !cantidadPersonas || !fechaReserva) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en la reserva.' });
    }

    const estadoReserva = 'En espera';

    const insertQuery = `
        INSERT INTO Reserva (
            idReserva, idActividad, estadoReserva,
            nombreTurista, correoTurista, cantidadPersonas, fechaReserva
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        insertQuery,
        [idReserva, idActividad, estadoReserva, nombreTurista, correoTurista, cantidadPersonas, fechaReserva],
        function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Error al registrar la reserva.' });
            }

            res.status(201).json({
                mensaje: 'Reserva creada con éxito',
                idReserva,
                estado: estadoReserva
            });
        }
    );
});

module.exports = router;
