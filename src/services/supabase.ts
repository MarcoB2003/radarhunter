import { createClient } from '@supabase/supabase-js';
import { Lead, LeadFormData } from '../types/lead';
import { EmpresaData } from '@/components/empresas/EmpresaPreview';
import { supabase as authSupabase } from './authService';

// Usamos o mesmo cliente Supabase da autenticação para garantir a sessão do usuário
export const supabase = authSupabase;

export const supabaseService = {
  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  },

  async createLead(lead: LeadFormData) {
    const { error } = await supabase
      .from('leads')
      .insert([lead]);

    if (error) throw error;
  },

  async updateLead(id: string, lead: Partial<LeadFormData>) {
    const { error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importLeads(leads: LeadFormData[]) {
    const { error } = await supabase
      .from('leads')
      .insert(leads);

    if (error) throw error;
  },

  async filterLeads(
    platform?: string,
    status?: string,
    engagementOrder?: 'asc' | 'desc'
  ) {
    let query = supabase.from('leads').select('*');

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (engagementOrder) {
      query = query.order('engagement_score', { ascending: engagementOrder === 'asc' });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Lead[];
  },
  
  // Empresas services
  async getEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('razao_social', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createEmpresa(empresa: EmpresaData) {
    const { error } = await supabase
      .from('empresas')
      .insert([empresa]);

    if (error) throw error;
  },

  async updateEmpresa(id: string, empresa: Partial<EmpresaData>) {
    const { error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteEmpresa(id: string) {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async importEmpresas(empresas: EmpresaData[]) {
    const { error } = await supabase
      .from('empresas')
      .insert(empresas);

    if (error) throw error;
  }
};
