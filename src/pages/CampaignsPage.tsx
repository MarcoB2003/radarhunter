import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import CampaignsDashboard from '../components/empresas/CampaignsDashboard';

const CampaignsPage: React.FC = () => {
  return (
    <MainLayout title="Campanhas">
      <CampaignsDashboard />
    </MainLayout>
  );
};

export default CampaignsPage;
