const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// POST /api/notificarPago
router.post('/notificarPago', async (req, res) => {
  const {
    idPago,
    idReserva,
    medioPago,
    monto,
    estadoPago,
    fechaPago
  } = req.body;

  // Validación básica
  if (!idPago || !idReserva || !medioPago || monto == null || !estadoPago || !fechaPago) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en el pago.' });
  }

  try {
    // 1. Insertar pago
    const { error: insertError } = await supabase
      .from('Pago_Municipio')
      .insert([{
        idPago,
        idReserva,
        medioPago,
        monto,
        estadoPago,
        fechaPago
      }]);

    if (insertError) {
      console.error('Error al insertar pago:', insertError.message);
      return res.status(500).json({ error: 'Error al registrar el pago.' });
    }

    // 2. Actualizar estado de la reserva
    const { error: updateError } = await supabase
      .from('Reserva_Municipio')
      .update({ estadoReserva: 'Confirmado' })
      .eq('idReserva', idReserva);

    if (updateError) {
      console.error('Error al actualizar estado de reserva:', updateError.message);
      return res.status(500).json({ error: 'Error al actualizar el estado de la reserva.' });
    }

    res.status(201).json({
      mensaje: 'Pago registrado y reserva confirmada exitosamente.',
      idPago,
      idReserva
    });

  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
