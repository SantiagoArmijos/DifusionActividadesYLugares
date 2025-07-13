const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/listarLugares?fechaDesde=YYYY-MM-DD&fechaHasta=YYYY-MM-DD
router.get('/listarLugares', async (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  if (!fechaDesde || !fechaHasta) {
    return res.status(400).json({ error: 'Debe proporcionar fechaDesde y fechaHasta en formato (YYYY-MM-DD).' });
  }

  const desde = new Date(fechaDesde);
  const hasta = new Date(fechaHasta);

  if (isNaN(desde) || isNaN(hasta)) {
    return res.status(400).json({ error: 'Fechas inválidas.' });
  }

  try {
    // Obtener actividades con sus lugares
    const { data, error } = await supabase
      .from('Actividad_Municipio')
      .select(`
        idLugar,
        Lugar_Municipio (
          idLugar,
          nombre,
          latitud,
          longitud,
          informacion
        )
      `)
      .gte('fechaInicio', fechaDesde)
      .lte('fechaFin', fechaHasta);

    if (error) {
      console.error('Error al consultar actividades:', error.message);
      return res.status(500).json({ error: 'Error al consultar actividades.' });
    }

    // Filtrar lugares únicos por idLugar
    const lugaresUnicos = new Map();

    for (const actividad of data) {
      const lugar = actividad.Lugar_Municipio;
      if (lugar && !lugaresUnicos.has(lugar.idLugar)) {
        lugaresUnicos.set(lugar.idLugar, {
          idLugar: lugar.idLugar,
          nombre: lugar.nombre,
          latitud: lugar.latitud,
          longitud: lugar.longitud,
          informacion: lugar.informacion
        });
      }
    }

    res.json(Array.from(lugaresUnicos.values()));
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
});

module.exports = router;
