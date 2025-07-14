const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/listar_todas_reservas
router.get('/listar_todas_reservas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Reserva_CuencaRA')
      .select('*'); // opcional: orden alfabético por nombre

    if (error) {
      console.error('Error al consultar Reserva_CuencaRA:', error.message);
      return res.status(500).json({ error: 'Error al consultar reservas.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
