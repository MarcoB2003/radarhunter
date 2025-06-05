import { PartialLeadData } from '@/types/lead';
import { LeadValidationResult } from './fileProcessor';

export const generateLeadsWithMissingFieldsReport = (leads: { lead: Record<string, any>; missingFields: string[]; index?: number; }[]): string => {
  // Criar cabeçalhos do relatório
  const headers = ['name', 'email', 'phone', 'company', 'position', 'platform', 'status', 'engagement_score', 'missing_fields'];
  
  // Criar linhas do relatório
  const rows = leads.map(lead => {
    const row: Record<string, string> = {};
    
    // Adicionar campos do lead
    headers.forEach(header => {
      if (header !== 'missing_fields') {
        row[header] = lead.lead[header as keyof PartialLeadData]?.toString() || '';
      }
    });
    
    // Adicionar campos faltantes
    row['missing_fields'] = lead.missingFields.join(', ');
    
    return row;
  });
  
  // Adicionar cabeçalhos
  rows.unshift(headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}));
  
  // Converter para CSV
  const csv = rows.map(row => 
    Object.values(row).map(value => 
      value.includes(',') ? `"${value}"` : value
    ).join(',')
  ).join('\n');
  
  return csv;
};
