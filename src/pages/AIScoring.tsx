
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import LeadScoringDashboard from '../components/empresas/LeadScoringDashboard';

const AIScoring: React.FC = () => {
  return (
    <MainLayout title="Scoring de Leads com IA">
      <LeadScoringDashboard />
    </MainLayout>
  );
};

export default AIScoring;
