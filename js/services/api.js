// js/services/api.js - Generic CRUD Service using Supabase Client
import { supabase } from '../config/supabase.js';

export async function fetchTableData(tableName, options = {}) {
  try {
    if (!supabase) return { data: [], error: 'Supabase não inicializado' };

    let query = supabase.from(tableName).select(options.select || '*');

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error(`Erro ao buscar dados da tabela ${tableName}:`, err.message);
    return { data: null, error: err.message };
  }
}

export async function insertRecord(tableName, record) {
  try {
    if (!supabase) throw new Error('Supabase não inicializado');
    const { data, error } = await supabase.from(tableName).insert([record]).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error(`Erro ao inserir na tabela ${tableName}:`, err.message);
    return { data: null, error: err.message };
  }
}

export async function updateRecord(tableName, id, updates) {
  try {
    if (!supabase) throw new Error('Supabase não inicializado');
    const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error(`Erro ao atualizar registro na tabela ${tableName}:`, err.message);
    return { data: null, error: err.message };
  }
}

export async function deleteRecord(tableName, id) {
  try {
    if (!supabase) throw new Error('Supabase não inicializado');
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error(`Erro ao deletar registro na tabela ${tableName}:`, err.message);
    return { error: err.message };
  }
}
