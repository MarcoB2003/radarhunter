import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import SocialMonitoringDashboard from '../components/empresas/SocialMonitoringDashboard';

const SocialPage: React.FC = () => {
  return (
    <MainLayout title="Social" requireAuth={false}>
      <SocialMonitoringDashboard />
    </MainLayout>
  );
};

export default SocialPage;
