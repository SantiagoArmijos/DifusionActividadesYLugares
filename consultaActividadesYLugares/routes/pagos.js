const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/actividades.db');

router.post('/notificarPago', (req, res) => {
    const {
        idPago,
        idReserva,
        medioPago,
        monto,
        estadoPago,
        fechaPago
    } = req.body;

    if (!idPago || !idReserva || !medioPago || monto == null || !estadoPago || !fechaPago) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en el pago.' });
    }

    db.serialize(() => {
        // Insertar pago
        const insertPagoQuery = `
            INSERT INTO Pago (
                idPago, idReserva, medioPago, monto, estadoPago, fechaPago
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(insertPagoQuery, [idPago, idReserva, medioPago, monto, estadoPago, fechaPago], function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al insertar el pago.' });
            }

            // Actualizar estadoReserva a 'Confirmado'
            const updateReservaQuery = `
                UPDATE Reserva SET estadoReserva = 'Confirmado' WHERE idReserva = ?
            `;

            db.run(updateReservaQuery, [idReserva], function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error al actualizar el estado de la reserva.' });
                }

                res.status(201).json({
                    mensaje: 'Pago registrado y reserva confirmada exitosamente.',
                    idPago,
                    idReserva
                });
            });
        });
    });
});

module.exports = router;
