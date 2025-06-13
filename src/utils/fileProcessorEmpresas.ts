import * as XLSX from 'xlsx';
import { EmpresaData } from '@/components/empresas/EmpresaPreview';

export const SUPPORTED_FILE_TYPES = {
  'text/csv': 'CSV',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-excel': 'XLS',
};

export const getSupportedFileTypes = () => Object.values(SUPPORTED_FILE_TYPES).join(', ');

// Função para limpar texto de caracteres especiais
const cleanText = (text: string | undefined): string => {
  if (!text) return '';
  
  try {
    // Tentar usar a versão normalizada para caracteres acentuados primeiro
    return text.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z0-9\s\-_.]/g, ''); // Remove caracteres especiais exceto alguns permitidos
  } catch (e) {
    // Fallback para substituição manual se normalize não funcionar
    const charMap: Record<string, string> = {
      'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
      'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
      'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
      'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
      'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
      'ç': 'c', 'ñ': 'n',
      'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A',
      'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
      'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
      'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
      'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
      'Ç': 'C', 'Ñ': 'N'
    };
    
    let result = text;
    for (const [special, normal] of Object.entries(charMap)) {
      result = result.split(special).join(normal);
    }
    return result.replace(/[^a-zA-Z0-9\s\-_.]/g, '');
  }
};

// Maps file headers to our empresa data fields
const HEADER_MAPPING: Record<string, keyof EmpresaData> = {
  // Common variations of field names that might appear in uploads
  'id': 'id',
  'uuid': 'id',
  'razao_social': 'razao_social',
  'razão social': 'razao_social',
  'nome empresa': 'razao_social',
  'empresa': 'razao_social',
  'cnpj': 'cnpj',
  'contato_principal': 'contato_principal',
  'contato principal': 'contato_principal',
  'contato': 'contato_principal',
  'nome contato': 'contato_principal',
  'email_1': 'email_1',
  'email1': 'email_1',
  'email': 'email_1',
  'email principal': 'email_1',
  'email_2': 'email_2',
  'email2': 'email_2',
  'email secundario': 'email_2',
  'email_3': 'email_3',
  'email3': 'email_3',
  'telefone_contato_principal': 'telefone_contato_principal',
  'telefone': 'telefone_contato_principal',
  'telefone contato': 'telefone_contato_principal',
  'cargo_contato': 'cargo_contato',
  'cargo': 'cargo_contato',
  'site_empresa': 'site_empresa',
  'site': 'site_empresa',
  'website': 'site_empresa',
  'segmento': 'segmento',
  'setor': 'segmento',
  'industria': 'segmento',
  'cidade': 'cidade',
  'estado': 'estado',
  'uf': 'estado',
  'observacoes': 'observacoes',
  'observações': 'observacoes',
  'obs': 'observacoes',
  'notas': 'observacoes',
};

// Process Excel or CSV file
export const processEmpresaFile = async (file: File): Promise<EmpresaData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Erro ao ler o arquivo');
        }
        
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        
        if (jsonData.length < 2) {
          throw new Error('Arquivo vazio ou sem dados suficientes');
        }
        
        // Get headers (first row) and map them to our fields
        const headers = jsonData[0] as string[];
        const mappedHeaders = headers.map(header => {
          const lowerHeader = String(header).toLowerCase().trim();
          return HEADER_MAPPING[lowerHeader] || null;
        });
        
        // If no razao_social field was found, error
        if (!mappedHeaders.includes('razao_social')) {
          throw new Error('Formato de arquivo inválido: Coluna de Razão Social não encontrada');
        }
        
        // Convert rows to empresa objects
        const empresas: EmpresaData[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row.length) continue; // Skip empty rows
          
          const empresa: Partial<EmpresaData> = {};
          
          // Map each cell to the corresponding field based on header mapping
          for (let j = 0; j < mappedHeaders.length; j++) {
            const field = mappedHeaders[j];
            if (field && row[j] !== undefined && row[j] !== null) {
              const value = row[j].toString().trim();
              
              // Salvar tanto a versão original quanto uma versão limpa para processamento interno
              if (field === 'razao_social') {
                // Para a razao_social, mantemos os acentos na interface
                empresa[field] = value;
                // Também podemos armazenar uma versão limpa se necessário para busca
                // empresa.razao_social_clean = cleanText(value);
              } else if (field === 'email_1' || field === 'email_2' || field === 'email_3') {
                // Emails não devem ser limpos, apenas trimmed
                empresa[field] = value.toLowerCase();
              } else if (field === 'cnpj') {
                // CNPJ deve manter apenas números
                empresa[field] = value.replace(/\D/g, '');
              } else if (field === 'telefone_contato_principal') {
                // Telefone deve manter apenas números
                empresa[field] = value.replace(/\D/g, '');
              } else {
                // Para outros campos podemos limpar caracteres especiais ou manter a versão original
                empresa[field] = value;
              }
            }
          }
          
          // Only add if it has a razao_social
          if (empresa.razao_social) {
            empresas.push(empresa as EmpresaData);
          }
        }
        
        resolve(empresas);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
