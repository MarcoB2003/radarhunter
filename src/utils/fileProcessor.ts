import { LeadFormData, PartialLeadData } from '@/types/lead';
import { LeadStatus } from '@/types/leadStatus';
import * as XLSX from 'xlsx';

// Função para criar modelo de Excel
export const createExcelTemplate = () => {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
    {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      platform: '',
      status: '',
      engagement_score: ''
    }
  ]);

  // Definir cabeçalhos
  const headers = ['name', 'email', 'phone', 'company', 'position', 'platform', 'status', 'engagement_score'];
  headers.forEach((header, index) => {
    ws[`A${index + 1}`] = { t: 's', v: header.charAt(0).toUpperCase() + header.slice(1) };
  });

  // Criar workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');

  return wb;
};

// Tipos de arquivo suportados

// Tipos de arquivo suportados
export const SUPPORTED_FILE_TYPES = {
  JSON: 'application/json',
  CSV: 'text/csv',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
};

// Campos obrigatórios
export const REQUIRED_FIELDS = ['name', 'email', 'phone', 'company', 'position', 'platform', 'status', 'engagement_score'] as const;

// Tipagem para o resultado da validação
export interface LeadValidationResult {
  valid: boolean;
  missingFields?: string[];
  lead: PartialLeadData;
}

// Função de validação de lead
export const validateLead = (lead: PartialLeadData): LeadValidationResult => {
  const missingFields: string[] = [];
  
  REQUIRED_FIELDS.forEach(field => {
    if (!lead[field]) {
      missingFields.push(field);
    }
  });

  return {
    valid: true, // Sempre válido, mesmo com campos faltantes
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    lead
  };
};

// Mapeamento de cabeçalhos
export const HEADER_MAPPING = {
  // Português
  'Nome': 'name',
  'nome': 'name',
  'E-mail': 'email',
  'email': 'email',
  'Telefone': 'phone',
  'telefone': 'phone',
  'Celular': 'phone',
  'celular': 'phone',
  'Empresa': 'company',
  'empresa': 'company',
  'Cargo': 'position',
  'cargo': 'position',
  'Função': 'position',
  'função': 'position',
  'Plataforma': 'platform',
  'plataforma': 'platform',
  'Rede': 'platform',
  'rede': 'platform',
  'Status': 'status',
  'status': 'status',
  'Situação': 'status',
  'situação': 'status',
  'Pontuação': 'engagement_score',
  'pontuacao': 'engagement_score',
  'Score': 'engagement_score',
  'score': 'engagement_score',

  // Inglês
  'Name': 'name',
  'First Name': 'name',
  'First_name': 'name',
  'Email': 'email',
  'Phone': 'phone',
  'Mobile': 'phone',
  'Company': 'company',
  'Position': 'position',
  'Role': 'position',
  'Platform': 'platform',
  'Network': 'platform',
  'State': 'status',
  'Points': 'engagement_score',
};

// Tipos de arquivo não suportados
export const UNSUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  TXT: 'text/plain',
};;

const normalizeHeader = (header: string): string => {
  // Remover acentos e caracteres especiais
  const normalized = header
    .normalize('NFD')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .trim();
  
  // Verificar se existe um mapeamento direto
  const mapped = HEADER_MAPPING[normalized];
  if (mapped) return mapped;
  
  // Verificar se existe uma variação do nome
  for (const [key, value] of Object.entries(HEADER_MAPPING)) {
    const keyNormalized = key
      .normalize('NFD')
      .replace(/[^\w\s]/g, '')
      .toLowerCase()
      .trim();
    
    if (normalized.includes(keyNormalized) || keyNormalized.includes(normalized)) {
      return value;
    }
  }
  
  // Se não encontrou mapeamento, retorna o nome original normalizado
  return normalized;
};

export const validateAndConvertLead = (lead: Record<string, any>): LeadFormData => {
  // Normalizar os campos do lead
  const normalizedLead: PartialLeadData = {};
  Object.entries(lead).forEach(([key, value]) => {
    const normalizedKey = normalizeHeader(key);
    normalizedLead[normalizedKey] = value;
  });



  // Converter os dados mantendo os campos opcionais
  const convertedLead: LeadFormData = {
    name: normalizedLead.name?.toString() || undefined,
    email: normalizedLead.email?.toString() || undefined,
    phone: normalizedLead.phone?.toString() || undefined,
    company: normalizedLead.company?.toString() || undefined,
    position: normalizedLead.position?.toString() || undefined,
    platform: normalizedLead.platform?.toString() || undefined,
    status: normalizedLead.status as LeadStatus || 'Novo',
    engagement_score: typeof normalizedLead.engagement_score === 'number' ? 
      normalizedLead.engagement_score : 
      (typeof normalizedLead.engagement_score === 'string' ? 
        parseInt(normalizedLead.engagement_score) : 
        0),
    is_complete: false, // Deixar o Supabase definir com trigger
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Remover campos undefined ou null
  Object.keys(convertedLead).forEach(key => {
    if (convertedLead[key] === undefined || convertedLead[key] === null) {
      delete convertedLead[key as keyof LeadFormData];
    }
  });

  return convertedLead;
};

export const processFile = async (file: File): Promise<LeadFormData[]> => {
  const fileType = file.type;
  let leads: PartialLeadData[] = [];

  try {
    switch (fileType) {
      case SUPPORTED_FILE_TYPES.JSON:
        const content = await file.text();
        leads = JSON.parse(content);
        break;
      case SUPPORTED_FILE_TYPES.CSV:
        const csvContent = await file.text();
        leads = processCSVContent(csvContent);
        break;
      case SUPPORTED_FILE_TYPES.XLSX:
      case SUPPORTED_FILE_TYPES.XLS:
        leads = await processExcelFile(file);
        break;
      default:
        throw new Error('Formato de arquivo não suportado');
    }

    // Validar e converter cada lead
    const validatedLeads = leads.map(validateAndConvertLead);
    return validatedLeads;
  } catch (error) {
    throw new Error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

const processJSONFile = async (file: File): Promise<LeadFormData[]> => {
  const content = await file.text();
  return JSON.parse(content);
};

const processCSVContent = (content: string): PartialLeadData[] => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Mapear cabeçalhos
  const mappedHeaders = headers.map(header => normalizeHeader(header));
  
  // Verificar se tem os campos obrigatórios após mapeamento
  const requiredHeaders = ['name', 'email'];
  const hasAllRequiredHeaders = requiredHeaders.every(header => 
    mappedHeaders.includes(header)
  );

  if (!hasAllRequiredHeaders) {
    throw new Error('Arquivo não contém os campos obrigatórios após o mapeamento automático. Verifique o cabeçalho da planilha.');
  }

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(value => value.trim());
      const lead: PartialLeadData = {};
      
      headers.forEach((header, index) => {
        if (index < values.length) {
          lead[normalizeHeader(header)] = values[index] || '';
        }
      });

      return lead;
    });
};

const processExcelFile = async (file: File): Promise<PartialLeadData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        reject(new Error('Não foi possível ler o arquivo'));
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Obter cabeçalhos usando o método correto do xlsx
        const jsonHeaders = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        const headers = jsonHeaders?.[0] || []; // Garantir que seja um array
        
        // Normalizar e mapear cabeçalhos
        const mappedHeaders = headers.map((header: string | number) => {
          // Normalizar texto
          const normalized = header
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^\w]/g, '');
          
          // Mapear para o campo correto
          return normalizeHeader(normalized);
        });
        
        // Verificar se tem os campos obrigatórios após mapeamento
        const requiredHeaders = ['name', 'email'];
        const hasAllRequiredHeaders = requiredHeaders.every(header => 
          mappedHeaders.includes(header)
        );

        if (!hasAllRequiredHeaders) {
          // Criar mensagem mais detalhada
          const missingHeaders = requiredHeaders.filter(header => !mappedHeaders.includes(header));
          reject(new Error(
            `Arquivo importado não possui os campos obrigatórios: ${missingHeaders.join(', ')}. ` +
            `Verifique se eles estão corretamente escritos na primeira linha do arquivo Excel.`
          ));
          return;
        }

        // Converter para JSON usando os cabeçalhos mapeados
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false
        });

        const rows = Array.isArray(jsonRows) ? jsonRows.slice(1) : []; // Remover cabeçalho
        
        // Validar e processar cada lead
        const results = rows.map((row: any[]) => {
          const lead: PartialLeadData = {};
          row.forEach((value: any, index: number) => {
            const header = mappedHeaders[index];
            if (header) {
              lead[header] = value;
            }
          });
          
          return validateLead(lead);
        });

        // Separar leads válidos e inválidos
        const validLeads = results
          .filter(result => result.valid)
          .map(result => result.lead);

        const invalidLeads = results
          .filter(result => !result.valid)
          .map(result => ({
            lead: result.lead,
            missingFields: result.missingFields!
          }));

        if (invalidLeads.length > 0) {
          // Criar mensagem detalhada
          const missingFieldsMessage = invalidLeads
            .map(lead => lead.missingFields.join(', '))
            .join(', ');

          throw new Error(
            `Importação parcial: ${validLeads.length} leads válidos, ${invalidLeads.length} inválidos. ` +
            `Campos faltantes: ${missingFieldsMessage}`
          );
        }

        resolve(validLeads);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel: ' + (error instanceof Error ? error.message : 'Erro desconhecido')));
      }
    };
    reader.onerror = (error) => reject(new Error('Erro ao ler arquivo: ' + error));
    reader.readAsBinaryString(file);
  });
};

const getFileType = (file: File): string => {
  return file.type;
};

export const getSupportedFileTypes = (): string => {
  return Object.values(SUPPORTED_FILE_TYPES)
    .map(type => type.split('/')[1])
    .join(', ');
};

export const getUnsupportedFileTypes = (): string => {
  return Object.values(UNSUPPORTED_FILE_TYPES)
    .map(type => type.split('/')[1])
    .join(', ');
};
