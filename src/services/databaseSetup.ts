import { supabase } from './authService';

// Função para verificar se as tabelas existem e criá-las se necessário usando SQL raw via Supabase
export const setupDatabase = async () => {
  try {
    // Criar tabela leads se não existir
    const { error: leadsError } = await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS public.leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          company VARCHAR(255),
          status VARCHAR(50) DEFAULT 'novo',
          platform VARCHAR(100),
          engagement_score INTEGER DEFAULT 0,
          last_contact TIMESTAMP,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now(),
          tags JSONB,
          notes TEXT
        );
      `
    });

    if (leadsError) {
      console.error('Erro ao criar tabela leads:', leadsError);
    } else {
      console.log('Tabela leads verificada/criada com sucesso!');
    }

    // Criar tabela empresas se não existir
    const { error: empresasError } = await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS public.empresas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          razao_social VARCHAR(255) NOT NULL,
          cnpj VARCHAR(20),
          contato_principal VARCHAR(255),
          email_1 VARCHAR(255),
          email_2 VARCHAR(255),
          email_3 VARCHAR(255),
          telefone_contato_principal VARCHAR(50),
          cargo_contato VARCHAR(100),
          site_empresa VARCHAR(255),
          segmento VARCHAR(100),
          cidade VARCHAR(100),
          estado VARCHAR(2),
          observacoes TEXT,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
        );
      `
    });

    if (empresasError) {
      console.error('Erro ao criar tabela empresas:', empresasError);
    } else {
      console.log('Tabela empresas verificada/criada com sucesso!');
    }

    return !leadsError && !empresasError;
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
    return false;
  }
};

// Função para criar stored procedures no Supabase
export const createStoredProcedures = async () => {
  try {
    // Criar função para criar tabela leads
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE OR REPLACE FUNCTION create_leads_table()
        RETURNS void AS $$
        BEGIN
          CREATE TABLE IF NOT EXISTS public.leads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(50),
            company VARCHAR(255),
            status VARCHAR(50) DEFAULT 'novo',
            platform VARCHAR(100),
            engagement_score INTEGER DEFAULT 0,
            last_contact TIMESTAMP,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            tags JSONB,
            notes TEXT
          );
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    // Criar função para criar tabela empresas
    await supabase.rpc('exec_sql', {
      sql_string: `
        CREATE OR REPLACE FUNCTION create_empresas_table()
        RETURNS void AS $$
        BEGIN
          CREATE TABLE IF NOT EXISTS public.empresas (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            razao_social VARCHAR(255) NOT NULL,
            cnpj VARCHAR(20),
            contato_principal VARCHAR(255),
            email_1 VARCHAR(255),
            email_2 VARCHAR(255),
            email_3 VARCHAR(255),
            telefone_contato_principal VARCHAR(50),
            cargo_contato VARCHAR(100),
            site_empresa VARCHAR(255),
            segmento VARCHAR(100),
            cidade VARCHAR(100),
            estado VARCHAR(2),
            observacoes TEXT,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
          );
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    console.log('Stored procedures criados com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar stored procedures:', error);
    return false;
  }
};
