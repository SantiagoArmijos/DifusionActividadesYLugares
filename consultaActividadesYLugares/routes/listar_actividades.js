const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/listarTodasLasActividades
router.get('/listarTodasLasActividades', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('Actividad_Municipio')
            .select('*') // Solo columnas directas de la tabla
            .order('fechaInicio', { ascending: true });

        if (error) {
            console.error('Error al consultar actividades:', error.message);
            return res.status(500).json({ error: 'Error al consultar actividades.' });
        }

        res.json(data); // Devolver tal cual
    } catch (err) {
        console.error('Error inesperado:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

module.exports = router;
