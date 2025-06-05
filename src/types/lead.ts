import { LeadStatus } from './leadStatus';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  platform: string;
  status: LeadStatus;
  engagement_score: number;
  created_at: string;
}

export interface LeadFormData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  platform?: string;
  status?: LeadStatus;
  engagement_score?: number;
  is_complete: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipagem parcial para processamento de arquivos
export interface PartialLeadData {
  [key: string]: string | number | boolean;
}
