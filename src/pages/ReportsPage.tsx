import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const ReportsPage: React.FC = () => {
  return (
    <MainLayout title="Relatórios">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Relatórios</h1>
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Relatórios de Vendas</h2>
            <p className="text-muted-foreground">Aqui você encontrará relatórios detalhados sobre suas vendas.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Relatórios de Leads</h2>
            <p className="text-muted-foreground">Análise de desempenho dos seus leads.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Relatórios de Campanhas</h2>
            <p className="text-muted-foreground">Performance das suas campanhas de marketing.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
