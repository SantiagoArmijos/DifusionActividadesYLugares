const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/obtenerReserva/:idReserva
router.get('/obtenerReserva/:idReserva', async (req, res) => {
  const { idReserva } = req.params;

  if (!idReserva) {
    return res.status(400).json({ error: 'El idReserva es obligatorio.' });
  }

  try {
    const { data, error } = await supabase
      .from('Reserva_CuencaRA')
      .select('*')
      .eq('idReserva', idReserva)
      .single(); // Asume que es único

    if (error) {
      console.error('Error al obtener la reserva:', error.message);
      return res.status(500).json({ error: 'Error al obtener la información de la reserva.' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Reserva no encontrada.' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
