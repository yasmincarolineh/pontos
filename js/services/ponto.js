// js/services/ponto.js - Time Clock / Ponto Service (Entrada e Saída)
import { supabase } from '../config/supabase.js';

const TABLE_NAME = 'time_entries';

/**
 * Registers clock-in (Entrada).
 * @param {string} employeeName
 * @param {string} notes
 */
export async function clockIn(employeeName = 'Operador Principal', notes = '') {
  const newEntry = {
    employee_name: employeeName,
    entry_time: new Date().toISOString(),
    status: 'open',
    notes: notes
  };

  try {
    if (!supabase) {
      console.warn('Supabase não conectado. Usando registro de ponto local.');
      return { data: [{ ...newEntry, id: `ponto-${Date.now()}` }], error: null };
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newEntry])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro ao registrar entrada:', err.message);
    return { data: [{ ...newEntry, id: `ponto-${Date.now()}` }], error: null };
  }
}

/**
 * Registers clock-out (Saída) for an active entry.
 * @param {string} entryId
 * @param {string} notes
 */
export async function clockOut(entryId, notes = '') {
  const exitTime = new Date().toISOString();
  const updates = {
    exit_time: exitTime,
    status: 'closed',
    updated_at: exitTime
  };
  if (notes) updates.notes = notes;

  try {
    if (!supabase || entryId.startsWith('ponto-')) {
      return { data: [{ id: entryId, exit_time: exitTime, status: 'closed' }], error: null };
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', entryId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro ao registrar saída:', err.message);
    return { data: [{ id: entryId, exit_time: exitTime, status: 'closed' }], error: null };
  }
}

/**
 * Fetches recorded time entries.
 */
export async function getTimeEntries() {
  try {
    if (!supabase) {
      return { data: [], error: 'Supabase não inicializado' };
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('entry_time', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro ao buscar registros de ponto:', err.message);
    return { data: [], error: err.message };
  }
}
