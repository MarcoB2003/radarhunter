// Tipagem para as configurações do Supabase
type SupabaseConfig = {
  url: string;
  key: string;
};

// Função para obter as configurações do Supabase
export const getSupabaseConfig = (): SupabaseConfig | null => {
  try {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') {
      return null;
    }

    // Primeiro tentar obter do __NEXT_DATA__
    let url = window.__NEXT_DATA__?.props?.pageProps?.NEXT_PUBLIC_SUPABASE_URL;
    let key = window.__NEXT_DATA__?.props?.pageProps?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Se não encontrar, tentar do __NEXT_DATA__ novamente
    if (!url || !key) {
      const nextData = window.__NEXT_DATA__?.props?.pageProps;
      url = nextData?.NEXT_PUBLIC_SUPABASE_URL;
      key = nextData?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    // Se ainda não encontrar, tentar diretamente do processo
    if (!url || !key) {
      url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }

    if (!url || !key) {
      console.error('Variáveis de ambiente do Supabase não encontradas');
      return null;
    }

    return {
      url,
      key
    };
  } catch (error) {
    console.error('Erro ao obter configuração do Supabase:', error);
    return null;
  }
};

// Função para obter o cliente do Supabase
export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Configuração do Supabase não disponível');
  }

  const { createClient } = require('@supabase/supabase-js');
  return createClient(config.url, config.key);
};
