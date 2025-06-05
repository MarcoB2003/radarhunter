import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltando configuração do Supabase. Por favor, configure as variáveis de ambiente.');
  throw new Error('Configuração do Supabase inválida');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
