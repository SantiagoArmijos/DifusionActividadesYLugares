const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear cliente Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// POST /api/insertarActividad
router.post('/insertarActividad', async (req, res) => {
    const {
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
        idLugar,
        cupoDisponible,
        precio
    } = req.body;

    // Validar campos obligatorios
    if (
        !nombre || !descripcion || !fechaInicio || !fechaFin ||
        !idLugar || cupoDisponible == null || precio == null
    ) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    // Validar formato de fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
        return res.status(400).json({ error: 'Fechas inválidas.' });
    }

    try {
        const { data, error } = await supabase
            .from('Actividad_Municipio')
            .insert([
                {
                    nombre,
                    descripcion,
                    fechaInicio,
                    fechaFin,
                    idLugar,
                    cupoDisponible,
                    precio
                }
            ])
            .select(); // Devuelve el registro insertado

        if (error) {
            console.error('Error al insertar actividad:', error.message);
            return res.status(500).json({ error: 'Error al insertar actividad.' });
        }

        res.status(201).json(data[0]); // Devolver el primer (y único) registro insertado
    } catch (err) {
        console.error('Error inesperado:', err);
        res.status(500).json({ error: 'Error del servidor.' });
    }
});

module.exports = router;
