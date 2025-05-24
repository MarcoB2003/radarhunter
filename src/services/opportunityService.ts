
import { supabase } from './authService';
import { Opportunity } from '../types';
import { v4 as uuidv4 } from 'uuid';

// CRUD operations for opportunities
export const fetchOpportunities = async () => {
  try {
    // Verifica se é um ambiente de teste
    if (localStorage.getItem('testUserLoggedIn') === 'true') {
      return getMockOpportunities();
    }
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('updatedAt', { ascending: false });
      
    if (error) throw error;
    
    return data as Opportunity[];
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
};

export const fetchOpportunityById = async (id: string) => {
  try {
    // Verifica se é um ambiente de teste
    if (localStorage.getItem('testUserLoggedIn') === 'true') {
      const mockOpportunities = getMockOpportunities();
      return mockOpportunities.find(opp => opp.id === id);
    }
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as Opportunity;
  } catch (error) {
    console.error('Error fetching opportunity by ID:', error);
    throw error;
  }
};

export const createOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Verifica se é um ambiente de teste
    if (localStorage.getItem('testUserLoggedIn') === 'true') {
      const newOpportunity = {
        id: uuidv4(),
        ...opportunity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const mockOpportunities = getMockOpportunities();
      localStorage.setItem('mockOpportunities', JSON.stringify([...mockOpportunities, newOpportunity]));
      
      return newOpportunity;
    }
    
    const { data, error } = await supabase
      .from('opportunities')
      .insert({
        ...opportunity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Opportunity;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    throw error;
  }
};

export const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
  try {
    // Verifica se é um ambiente de teste
    if (localStorage.getItem('testUserLoggedIn') === 'true') {
      const mockOpportunities = getMockOpportunities();
      const updatedOpportunities = mockOpportunities.map(opp => {
        if (opp.id === id) {
          return {
            ...opp,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return opp;
      });
      
      localStorage.setItem('mockOpportunities', JSON.stringify(updatedOpportunities));
      
      return updatedOpportunities.find(opp => opp.id === id);
    }
    
    const { data, error } = await supabase
      .from('opportunities')
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data as Opportunity;
  } catch (error) {
    console.error('Error updating opportunity:', error);
    throw error;
  }
};

export const deleteOpportunity = async (id: string) => {
  try {
    // Verifica se é um ambiente de teste
    if (localStorage.getItem('testUserLoggedIn') === 'true') {
      const mockOpportunities = getMockOpportunities();
      const filteredOpportunities = mockOpportunities.filter(opp => opp.id !== id);
      
      localStorage.setItem('mockOpportunities', JSON.stringify(filteredOpportunities));
      
      return true;
    }
    
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    throw error;
  }
};

export const moveOpportunityToStage = async (id: string, stageId: string) => {
  try {
    return await updateOpportunity(id, { stageId });
  } catch (error) {
    console.error('Error moving opportunity:', error);
    throw error;
  }
};

// Função auxiliar para gerar dados de teste
const getMockOpportunities = (): Opportunity[] => {
  const storedOpportunities = localStorage.getItem('mockOpportunities');
  
  if (storedOpportunities) {
    return JSON.parse(storedOpportunities);
  }
  
  // Dados iniciais de exemplo
  const mockData: Opportunity[] = [
    {
      id: "opp-1",
      title: "Implementação de CRM",
      value: 12000,
      leadId: "lead-1",
      stageId: "proposal",
      closingProbability: 65,
      expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Cliente demonstrou interesse na solução completa",
      assignedTo: "Ana Silva",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "opp-2",
      title: "Consultoria de Marketing Digital",
      value: 5000,
      leadId: "lead-2",
      stageId: "qualified",
      closingProbability: 40,
      expectedCloseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Precisamos agendar uma demonstração detalhada",
      assignedTo: "Carlos Santos",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "opp-3",
      title: "Licença Premium Anual",
      value: 18000,
      leadId: "lead-3",
      stageId: "negotiation",
      closingProbability: 85,
      expectedCloseDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Cliente solicitou desconto por volume",
      assignedTo: "Mariana Costa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];
  
  // Armazena os dados mockados no localStorage
  localStorage.setItem('mockOpportunities', JSON.stringify(mockData));
  
  return mockData;
};
