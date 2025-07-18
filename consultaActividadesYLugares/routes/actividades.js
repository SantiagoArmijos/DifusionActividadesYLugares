const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET /api/listarActividades?fechaInicio=2025-07-01&fechaFin=2025-07-31
router.get('/listarActividades', async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
            error: 'Debe proporcionar fechaInicio y fechaFin en formato ISO (YYYY-MM-DD).'
        });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
        return res.status(400).json({ error: 'Fechas inválidas.' });
    }

    try {
        const { data, error } = await supabase
            .from('Actividad_Municipio')
            .select('*') // Solo columnas directas de la tabla
            .gte('fechaInicio', fechaInicio)
            .lte('fechaFin', fechaFin)
            .order('fechaInicio', { ascending: true });

        if (error) {
            console.error('Error al consultar actividades:', error.message);
            return res.status(500).json({ error: 'Error al consultar actividades.' });
        }

        res.json(data); // Devolver tal cual sin procesar relaciones
    } catch (err) {
        console.error('Error inesperado:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

module.exports = router;
