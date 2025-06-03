import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AnalyticsDashboard from '../components/empresas/AnalyticsDashboard';

const EmpresasPage: React.FC = () => {
  return (
    <MainLayout title="Empresas">
      <AnalyticsDashboard />
    </MainLayout>
  );
};

export default EmpresasPage;
