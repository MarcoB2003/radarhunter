
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AICloserDashboard from '../components/empresas/AICloserDashboard';

const AICloser: React.FC = () => {
  return (
    <MainLayout title="IA Closer - Fechamento Inteligente">
      <AICloserDashboard />
    </MainLayout>
  );
};

export default AICloser;
