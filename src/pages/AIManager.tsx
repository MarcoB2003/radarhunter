
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import AIManagerDashboard from '../components/dashboard/AIManagerDashboard';

const AIManager: React.FC = () => {
  return (
    <MainLayout title="Gerente de IA">
      <AIManagerDashboard />
    </MainLayout>
  );
};

export default AIManager;
