
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AISdrDashboard from '../components/empresas/AISdrDashboard';

const AISdr: React.FC = () => {
  return (
    <MainLayout title="IA SDR - Prospecção Inteligente">
      <AISdrDashboard />
    </MainLayout>
  );
};

export default AISdr;
