-- SQL script para criar as tabelas necessárias no Supabase

-- Criar tabela de leads se não existir
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

-- Criar tabela de empresas se não existir
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
