import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Inserta datos en una tabla de Supabase
 * @param {string} table - Nombre de la tabla
 * @param {object|object[]} data - Objeto o arreglo de objetos a insertar
 * @returns {Promise<boolean>} - true si se insertó correctamente, false si hubo error
 */
export async function insertData(table, data) {
  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.error('Error al insertar:', error.message);
  }
  return !error;
}

/**
 * Lista datos desde una tabla de Supabase
 * @param {string} table - Nombre de la tabla
 * @param {object} [filters] - Filtros opcionales (ej: { id: 1 })
 * @returns {Promise<object[]|null>} - Arreglo de objetos si tiene éxito, null si hay error
 */
export async function selectData(table, filters = {}) {
  let query = supabase.from(table).select('*');
  
  if (filters && Object.keys(filters).length > 0) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error al listar:', error.message);
    return null;
  }
  return data;
}

/**
 * Actualiza datos en una tabla de Supabase
 * @param {string} table - Nombre de la tabla
 * @param {object} matchConditions - Condiciones para encontrar los registros (ej: { id: 1 })
 * @param {object} newData - Campos a actualizar (ej: { nombre: 'Nuevo Nombre' })
 * @returns {Promise<boolean>} - true si se actualizó correctamente, false si hubo error
 */
export async function updateData(table, matchConditions, newData) {
  let query = supabase.from(table).update(newData);

  Object.entries(matchConditions).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  const { error } = await query;
  if (error) {
    console.error('Error al actualizar:', error.message);
  }
  return !error;
}