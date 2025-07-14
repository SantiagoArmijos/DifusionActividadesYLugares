import express from 'express';
import { insertData } from './db/supabase.js';

const app = express();
const port = 3000;

app.use(express.json());

// Ruta para insertar un nuevo producto
app.post('/product', async (req, res) => {
  const { nombre, description } = req.body;

  // Validación básica
  if (!nombre || !description) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre o description' });
  }

  const success = await insertData('product', { nombre, description });

  if (success) {
    res.status(201).json({ message: 'Producto insertado correctamente' });
  } else {
    res.status(500).json({ error: 'Error al insertar el producto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});