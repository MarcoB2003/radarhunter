import { supabase } from '../lib/supabaseClient';
import { Opportunity } from '@/types/opportunity';
import { v4 as uuidv4 } from 'uuid';

// CREATE
export const createOpportunity = async (opportunity: Omit<Opportunity, 'id'>) => {
  console.log('Dados recebidos:', opportunity);
  
  const newOpportunity: Opportunity = {
    ...opportunity,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: uuidv4() // Gerando um UUID válido para o owner
  };
  
  console.log('Dados formatados:', newOpportunity);

  const { data, error } = await supabase
    .from('opportunities')
    .insert([newOpportunity])
    .select('*')
    .single();

  if (error) {
    console.error('Erro ao criar oportunidade:', error);
    console.error('Tipo do erro:', typeof error);
    console.error('Mensagem do erro:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error(error.message || 'Falha ao criar oportunidade');
  }
  
  if (!data) {
    console.error('Dados não retornados após inserção');
    throw new Error('Falha ao criar oportunidade');
  }

  console.log('Dados retornados:', data);
  return data;
};

// FETCH
export const fetchOpportunities = async (): Promise<Opportunity[]> => {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

// UPDATE
export const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
  const { data, error } = await supabase
    .from('opportunities')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error('Falha ao atualizar oportunidade');
  return data[0];
};

// DELETE
export const deleteOpportunity = async (id: string) => {
  const { error } = await supabase
    .from('opportunities')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};
