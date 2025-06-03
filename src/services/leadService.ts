
import { supabase } from './authService';
import { Lead } from '../types';

// CRUD operations for leads
export const fetchLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, contacts(*)')
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    
    return data as Lead[];
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const fetchLeadById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, contacts(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as Lead;
  } catch (error) {
    console.error('Error fetching lead by ID:', error);
    throw error;
  }
};

export const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // First, create the lead without contacts
    const { contacts, ...leadData } = lead;
    
    const { data: newLead, error: leadError } = await supabase
      .from('leads')
      .insert({
        ...leadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (leadError) throw leadError;
    
    // Then, create the contacts with the new lead ID
    if (contacts && contacts.length > 0) {
      const contactsWithLeadId = contacts.map(contact => ({
        ...contact,
        leadId: newLead.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      const { error: contactsError } = await supabase
        .from('contacts')
        .insert(contactsWithLeadId);
        
      if (contactsError) throw contactsError;
    }
    
    // Finally, fetch the complete lead with contacts
    return fetchLeadById(newLead.id);
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const updateLead = async (id: string, updates: Partial<Lead>) => {
  try {
    const { contacts, ...leadUpdates } = updates;
    
    // Update the lead first
    const { error: leadError } = await supabase
      .from('leads')
      .update({
        ...leadUpdates,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id);
      
    if (leadError) throw leadError;
    
    // If contacts are included in the updates, handle them
    if (contacts) {
      // This is a simplified approach. For a real app, you'd need
      // more complex logic to handle contact additions, updates, and deletions
      for (const contact of contacts) {
        if (contact.id) {
          // Update existing contact
          const { error } = await supabase
            .from('contacts')
            .update({
              ...contact,
              updatedAt: new Date().toISOString(),
            })
            .eq('id', contact.id);
            
          if (error) throw error;
        } else {
          // Create new contact
          const { error } = await supabase
            .from('contacts')
            .insert({
              ...contact,
              leadId: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            
          if (error) throw error;
        }
      }
    }
    
    // Return the updated lead with contacts
    return fetchLeadById(id);
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

export const deleteLead = async (id: string) => {
  try {
    // First delete all contacts related to this lead (cascade delete would be better)
    const { error: contactsError } = await supabase
      .from('contacts')
      .delete()
      .eq('leadId', id);
      
    if (contactsError) throw contactsError;
    
    // Then delete the lead
    const { error: leadError } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
      
    if (leadError) throw leadError;
    
    return true;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
};

// Mock function for importing leads from CSV
export const importLeadsFromCsv = async (fileData: string) => {
  try {
    // For MVP, we'll just use a simple mock implementation
    // In a real app, this would parse the CSV and create leads
    const mockLeads: Lead[] = [
      {
        id: `mock-${Date.now()}-1`,
        companyName: "TechSoft Sistemas",
        segment: "SaaS",
        website: "techsoft.com.br",
        source: "Website",
        contacts: [
          {
            id: `mock-contact-${Date.now()}-1`,
            name: "Ricardo Silva",
            role: "CEO",
            email: "ricardo@techsoft.com.br",
            phone: "(11) 98765-4321",
            isDecisionMaker: true,
            leadId: `mock-${Date.now()}-1`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ],
        temperature: "hot",
        score: {
          behavioral: 85,
          profile: 90,
          temporal: 80,
          total: 85
        },
        digitalPresence: {
          website: true,
          linkedin: true,
          socialMedia: 3,
          techMaturity: 'high'
        },
        status: "new",
        priority: "high",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `mock-${Date.now()}-2`,
        companyName: "Inova Financeira",
        segment: "Finanças",
        website: "inovafinanceira.com.br",
        source: "LinkedIn",
        contacts: [
          {
            id: `mock-contact-${Date.now()}-2`,
            name: "Maria Santos",
            role: "Diretora",
            email: "maria@inovafinanceira.com.br",
            phone: "(21) 99876-5432",
            isDecisionMaker: true,
            leadId: `mock-${Date.now()}-2`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ],
        temperature: "warm",
        score: {
          behavioral: 65,
          profile: 70,
          temporal: 60,
          total: 65
        },
        digitalPresence: {
          website: true,
          linkedin: false,
          socialMedia: 1,
          techMaturity: 'medium'
        },
        status: "new",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    return mockLeads;
  } catch (error) {
    console.error('Error importing leads:', error);
    throw error;
  }
};

// For the MVP, we'll implement a simple lead scoring function
export const scoreLeads = async (leadIds: string[]) => {
  try {
    // In a real app, this would call an AI-powered scoring algorithm
    // For now, we'll just update with random scores
    const scoredLeads: Lead[] = [];
    
    for (const id of leadIds) {
      const lead = await fetchLeadById(id);
      
      // Generate scores for each dimension
      const behavioral = Math.floor(Math.random() * 100);
      const profile = Math.floor(Math.random() * 100);
      const temporal = Math.floor(Math.random() * 100);
      const total = Math.floor((behavioral + profile + temporal) / 3);
      
      const score = {
        behavioral,
        profile,
        temporal,
        total
      };
      
      let temperature: 'hot' | 'warm' | 'cold';
      if (total >= 70) {
        temperature = 'hot';
      } else if (total >= 40) {
        temperature = 'warm';
      } else {
        temperature = 'cold';
      }
      
      let priority: 'low' | 'medium' | 'high' | 'critical';
      if (total >= 85) {
        priority = 'critical';
      } else if (total >= 70) {
        priority = 'high';
      } else if (total >= 40) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
      
      const updatedLead = await updateLead(id, {
        score,
        temperature,
        priority,
        aiRecommendation: generateRecommendation(total),
      });
      
      scoredLeads.push(updatedLead);
    }
    
    return scoredLeads;
  } catch (error) {
    console.error('Error scoring leads:', error);
    throw error;
  }
};

// Helper function to generate a simple recommendation based on score
const generateRecommendation = (score: number): string => {
  if (score >= 90) {
    return 'Contatar imediatamente para agendar apresentação.';
  } else if (score >= 70) {
    return 'Boa oportunidade, enviar proposta personalizada.';
  } else if (score >= 50) {
    return 'Iniciar qualificação por email para verificar interesse.';
  } else if (score >= 30) {
    return 'Incluir em campanha de nutrição por 3 meses.';
  } else {
    return 'Baixa prioridade, manter monitoramento passivo.';
  }
};
