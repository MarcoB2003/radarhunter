declare global {
  interface Window {
    __NEXT_DATA__: {
      props: {
        pageProps: {
          NEXT_PUBLIC_SUPABASE_URL: string;
          NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        };
      };
    };
  };
}

// Função para obter as configurações do Supabase
export const getSupabaseConfig = () => {
  const url = window.__NEXT_DATA__?.props?.pageProps?.NEXT_PUBLIC_SUPABASE_URL;
  const key = window.__NEXT_DATA__?.props?.pageProps?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Variáveis de ambiente do Supabase não configuradas');
    return null;
  }

  return {
    url,
    key
  };
};
