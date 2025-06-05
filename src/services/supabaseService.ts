import { createClient } from '@supabase/supabase-js';
import { LeadFormData } from '@/types/lead';
import { createClient as createClientClient } from '@/config/client/supabase-client';
import { getServerConfig } from '@/config/server/supabase-server';

// Garantir que só criamos uma instância do Supabase
let supabaseInstance: any = null;

const getSupabase = () => {
  // Verificar se estamos no lado do cliente
  if (typeof window !== 'undefined') {
    // Usar configuração do cliente
    try {
      if (!supabaseInstance) {
        supabaseInstance = createClientClient();
      }
    } catch (error) {
      console.error('Erro ao criar cliente no cliente:', error);
      throw new Error('Não foi possível inicializar o cliente do Supabase');
    }
  } else {
    // Usar configuração do servidor
    const config = getServerConfig();
    if (!config.url || !config.key) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas');
    }

    if (!supabaseInstance) {
      supabaseInstance = createClient(config.url, config.key);
    }
  }

  return supabaseInstance;
};

// Inicialização do Supabase
const supabase = getSupabase();

// Interface para arquivos de importação
interface ImportedFile {
  id: string;
  name: string;
  created_at: string;
}

// Interface para lead com ID
interface LeadWithId extends LeadFormData {
  id: string;
}

export const supabaseService = {
  // Salvar leads no Supabase
  async saveLeads(leads: LeadFormData[]): Promise<LeadWithId[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leads)
        .select();

      if (error) throw error;
      return data as LeadWithId[];
    } catch (error) {
      console.error('Erro ao salvar leads:', error);
      throw error;
    }
  },

  // Salvar arquivo de importação
  async saveImportedFile(fileName: string): Promise<ImportedFile> {
    try {
      const { data, error } = await supabase
        .from('imported_files')
        .insert([
          {
            name: fileName,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data as ImportedFile;
    } catch (error) {
      console.error('Erro ao salvar arquivo de importação:', error);
      throw error;
    }
  },

  // Listar arquivos de importação
  async listImportedFiles(): Promise<ImportedFile[]> {
    try {
      const { data, error } = await supabase
        .from('imported_files')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ImportedFile[];
    } catch (error) {
      console.error('Erro ao listar arquivos de importação:', error);
      throw error;
    }
  },

  // Buscar leads por arquivo de importação
  async getLeadsByFileId(fileId: string): Promise<LeadWithId[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select()
        .eq('file_id', fileId);

      if (error) throw error;
      return data as LeadWithId[];
    } catch (error) {
      console.error('Erro ao buscar leads por arquivo:', error);
      throw error;
    }
  }
};
