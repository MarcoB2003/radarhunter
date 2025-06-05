export const getSupabaseConfig = () => {
  // Verificar se estamos no lado do cliente
  if (typeof window === 'undefined') {
    return null;
  }

  // Valores fixos para desenvolvimento
  const fallbackUrl = 'https://gntccknejxmfunltwxuu.supabase.co';
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudGNja25lanhtZnVubHR3eHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTI1NDEsImV4cCI6MjA2NDUyODU0MX0.xa6SRmR5Su-cKISZu7Owa746DFijlz2UFOgGSQjXIAk';

  // Primeiro tentar obter do __NEXT_DATA__
  const nextData = window.__NEXT_DATA__?.props?.pageProps;
  const url = nextData?.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
  const key = nextData?.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackKey;

  // Se não encontrar, tentar do localStorage
  if (!url || !key) {
    const urlFromStorage = localStorage.getItem('NEXT_PUBLIC_SUPABASE_URL') || fallbackUrl;
    const keyFromStorage = localStorage.getItem('NEXT_PUBLIC_SUPABASE_ANON_KEY') || fallbackKey;
    
    if (urlFromStorage && keyFromStorage) {
      return {
        url: urlFromStorage,
        key: keyFromStorage
      };
    }
  }

  if (!url || !key) {
    return {
      url: fallbackUrl,
      key: fallbackKey
    };
  }

  return {
    url,
    key
  };
};
