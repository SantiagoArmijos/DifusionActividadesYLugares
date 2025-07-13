const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/listarLugares
router.get('/listar_todos_Lugares', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Lugar_Municipio')
      .select('*')
      .order('nombre', { ascending: true }); // opcional: orden alfabético por nombre

    if (error) {
      console.error('Error al consultar lugares:', error.message);
      return res.status(500).json({ error: 'Error al consultar lugares.' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
