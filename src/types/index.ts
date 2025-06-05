
// User related types
export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'agent';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// Lead related types
export type Temperature = 'hot' | 'warm' | 'cold';

export type LeadScore = {
  behavioral: number; // 0-100
  profile: number; // 0-100
  temporal: number; // 0-100
  total: number; // 0-100
};

export type DigitalPresence = {
  website: boolean;
  linkedin: boolean;
  socialMedia: number; // quantidade de redes sociais
  techMaturity: 'low' | 'medium' | 'high';
};

export type Lead = {
  id: string;
  companyName: string;
  segment: string;
  website?: string;
  source: string;
  contacts: Contact[];
  notes?: string;
  temperature: Temperature;
  score: LeadScore;
  digitalPresence: DigitalPresence;
  status: 'new' | 'contacted' | 'qualified' | 'disqualified';
  assignedTo?: string;
  aiRecommendation?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  isDecisionMaker: boolean;
  leadId: string;
  socialSignals?: SocialSignal[];
  createdAt: string;
  updatedAt: string;
};

// Tipo específico para o componente SocialMonitoringDashboard
export type SocialContact = {
  id: string;
  name: string;
  role: string;
  company: string;
  last_activity_type: string;
  last_activity_time: string;
  platform: string;
  alert: string;
  status: string;
  engagement_score: number;
  avatar_url?: string;
};

// Social Monitoring types
export type SocialSignal = {
  id: string;
  platform: 'linkedin' | 'twitter' | 'facebook';
  type: 'job_change' | 'post_interaction' | 'connection' | 'engagement';
  content: string;
  relevanceScore: number;
  timestamp: string;
  contactId: string;
};

// Pipeline related types
export type OpportunityStage = 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'lost';

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  status: string;
  companyId: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
};

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

// Removendo exportações duplicadas
// export type { Opportunity } from './opportunity';
// export { SocialContact } from './index';

// IA Closer types
export type BuyingSignal = {
  id: string;
  type: 'explicit' | 'implicit';
  signal: string;
  confidence: number;
  detectedAt: string;
  opportunityId: string;
};

export type ObjectionResponse = {
  id: string;
  objection: string;
  response: string;
  effectiveness: number;
  usedAt: string;
};

// Campaign types
export type CampaignType = 'email' | 'whatsapp' | 'linkedin' | 'multicanal';

export type Campaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: 'draft' | 'active' | 'paused' | 'completed';
  segments: string[];
  contactCount: number;
  sentCount: number;
  openCount: number;
  responseCount: number;
  personalizationLevel: 'basic' | 'advanced' | 'ai_generated';
  abTestVariants?: ABTestVariant[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type ABTestVariant = {
  id: string;
  name: string;
  messageTemplate: string;
  performance: {
    sent: number;
    opened: number;
    responded: number;
  };
};

// AI related types
export type AiMessage = {
  id: string;
  senderId: string;
  senderType: 'human' | 'ai';
  senderName: string;
  content: string;
  contactId?: string;
  timestamp: string;
};

export type AiSuggestion = {
  id: string;
  type: 'message' | 'action' | 'insight';
  title: string;
  content: string;
  entityId?: string;
  entityType?: 'lead' | 'opportunity' | 'contact';
  timestamp: string;
};

// Analytics types
export type KPI = {
  id: string;
  name: string;
  value: number;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
};

export type Forecast = {
  model: 'historical' | 'pipeline_weighted' | 'machine_learning';
  period: string;
  value: number;
  confidence: number;
};

// AI Manager types
export type AIMode = 'conservative' | 'balanced' | 'aggressive';

export type AlertLevel = 'info' | 'warning' | 'critical';

export type AIAlert = {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  entityType: 'lead' | 'opportunity' | 'campaign';
  entityId: string;
  actionRequired: boolean;
  timestamp: string;
};

export type AIOptimization = {
  id: string;
  type: 'timing' | 'messaging' | 'segmentation' | 'budget';
  description: string;
  impact: number;
  implementedAt?: string;
  results?: {
    before: number;
    after: number;
    improvement: number;
  };
};
