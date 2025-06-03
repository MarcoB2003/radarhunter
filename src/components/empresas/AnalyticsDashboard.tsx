
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Target, Users } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Empresas Avançadas
        </CardTitle>
        <CardDescription>KPIs personalizados e forecasting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Forecast ML</span>
            <span className="font-medium">R$ 125k</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">ROI Campanhas</span>
            <span className="font-medium text-green-600">+34%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Score Médio</span>
            <span className="font-medium">76/100</span>
          </div>
        </div>
        <Button className="w-full mt-4" variant="outline">
          Dashboard Completo
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
