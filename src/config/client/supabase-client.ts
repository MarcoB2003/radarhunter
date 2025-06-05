import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './supabase-client-config';

// Função para criar o cliente do Supabase no cliente
export function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Configuração do Supabase não disponível');
  }

  return createSupabaseClient(config.url, config.key);
}
