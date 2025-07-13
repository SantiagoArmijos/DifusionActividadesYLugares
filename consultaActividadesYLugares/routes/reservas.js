const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// POST /api/reservaActividad
router.post('/reservaActividad', async (req, res) => {
  const {
    idReserva,
    idActividad,
    nombreTurista,
    correoTurista,
    cantidadPersonas,
    fechaReserva
  } = req.body;

  // Validación básica
  if (!idReserva || !idActividad || !nombreTurista || !correoTurista || !cantidadPersonas || !fechaReserva) {
    return res.status(400).json({ error: 'Faltan campos obligatorios en la reserva.' });
  }

  const estadoReserva = 'En espera';

  try {
    // Insertar reserva en Supabase
    const { error } = await supabase
      .from('Reserva_Municipio')
      .insert([{
        idReserva,
        idActividad,
        estadoReserva,
        nombreTurista,
        correoTurista,
        cantidadPersonas,
        fechaReserva
      }]);

    if (error) {
      console.error('Error al insertar reserva:', error.message);
      return res.status(500).json({ error: 'Error al registrar la reserva.' });
    }

    res.status(201).json({
      mensaje: 'Reserva creada con éxito',
      idReserva,
      estado: estadoReserva
    });

  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
