// js/services/auth.js - Authentication Service
import { supabase } from '../config/supabase.js';

export async function loginUser(email, password) {
  try {
    if (!supabase) throw new Error('Cliente Supabase não configurado');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro de login:', err.message);
    return { data: null, error: err.message };
  }
}

export async function logoutUser() {
  try {
    if (!supabase) return { error: null };
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Erro de logout:', err.message);
    return { error: err.message };
  }
}

export async function getCurrentUser() {
  try {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Erro ao buscar usuário:', err.message);
    return null;
  }
}
