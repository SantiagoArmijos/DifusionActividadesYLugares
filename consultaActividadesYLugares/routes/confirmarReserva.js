const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// PUT /api/confirmarReserva/:idReserva
router.put('/confirmarReserva/:idReserva', async (req, res) => {
  const { idReserva } = req.params;

  if (!idReserva) {
    return res.status(400).json({ error: 'El idReserva es obligatorio.' });
  }

  try {
    // Actualizar el estado a "Confirmado"
    const { data, error } = await supabase
      .from('Reserva_CuencaRA')
      .update({ estadoReserva: 'Confirmado' })
      .eq('idReserva', idReserva)
      .select()
      .single(); // Devuelve el registro actualizado

    if (error) {
      console.error('Error al actualizar la reserva:', error.message);
      return res.status(500).json({ error: 'Error al confirmar la reserva.' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    res.status(200).json({
      mensaje: 'Reserva confirmada exitosamente.',
      reservaActualizada: data
    });

  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
