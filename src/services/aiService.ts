
import { AiMessage, AiSuggestion } from '../types';

// Mock function for AI message generation
export const generateAiMessage = async (
  prompt: string,
  context?: string,
  contactId?: string
): Promise<AiMessage> => {
  try {
    // In a real app, this would call the OpenAI API
    // For now, we'll simulate a response
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response generation logic
    let content = '';
    if (prompt.toLowerCase().includes('olá') || prompt.toLowerCase().includes('oi')) {
      content = 'Olá! Em que posso ajudar sua empresa hoje?';
    } else if (prompt.toLowerCase().includes('preço') || prompt.toLowerCase().includes('valor')) {
      content = 'Nossos planos começam em R$997/mês. Posso agendar uma demonstração para mostrar o valor que podemos agregar ao seu negócio.';
    } else if (prompt.toLowerCase().includes('demo') || prompt.toLowerCase().includes('apresentação')) {
      content = 'Ótimo! Vamos agendar uma demonstração. Qual seria o melhor dia e horário para você?';
    } else {
      content = 'Entendi sua necessidade. Nossa solução pode ajudar a aumentar suas vendas em até 30%. Podemos conversar mais sobre isso?';
    }
    
    // Create message object
    const message: AiMessage = {
      id: Date.now().toString(),
      senderId: 'ai-agent',
      senderType: 'ai',
      senderName: 'AI Assistant',
      content,
      contactId,
      timestamp: new Date().toISOString(),
    };
    
    return message;
  } catch (error) {
    console.error('Error generating AI message:', error);
    throw new Error('Falha ao gerar mensagem com IA. Por favor, tente novamente.');
  }
};

// Generate AI suggestions based on lead or opportunity data
export const generateAiSuggestions = async (
  entityType: 'lead' | 'opportunity' | 'contact',
  entityData: any
): Promise<AiSuggestion[]> => {
  try {
    // In a real app, this would call the OpenAI API
    // For now, we'll generate mock suggestions
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions: AiSuggestion[] = [];
    
    if (entityType === 'lead') {
      suggestions.push({
        id: `suggestion-${Date.now()}-1`,
        type: 'message',
        title: 'Mensagem de qualificação',
        content: `Olá ${entityData.contacts?.[0]?.name || 'gestor'}, notei que sua empresa ${entityData.companyName} está no setor de ${entityData.segment}. Gostaria de conhecer como estamos ajudando empresas similares a aumentar vendas em 30%?`,
        entityId: entityData.id,
        entityType: 'lead',
        timestamp: new Date().toISOString(),
      });
      
      suggestions.push({
        id: `suggestion-${Date.now()}-2`,
        type: 'action',
        title: 'Próximos passos',
        content: 'Enviar email com estudo de caso do setor e agendar call de 15 minutos.',
        entityId: entityData.id,
        entityType: 'lead',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (entityType === 'opportunity') {
      suggestions.push({
        id: `suggestion-${Date.now()}-3`,
        type: 'insight',
        title: 'Análise da oportunidade',
        content: `Baseado no histórico de interações, há 75% de chance de fechar se abordarmos especificamente a questão do ROI nos primeiros 3 meses.`,
        entityId: entityData.id,
        entityType: 'opportunity',
        timestamp: new Date().toISOString(),
      });
      
      suggestions.push({
        id: `suggestion-${Date.now()}-4`,
        type: 'action',
        title: 'Estratégia recomendada',
        content: 'Enviar proposta com desconto de 10% para fechamento até o final da semana.',
        entityId: entityData.id,
        entityType: 'opportunity',
        timestamp: new Date().toISOString(),
      });
    }
    
    return suggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    throw new Error('Falha ao gerar sugestões com IA. Por favor, tente novamente.');
  }
};
