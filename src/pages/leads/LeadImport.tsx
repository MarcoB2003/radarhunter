import React, { useRef } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpCircle, FileUp } from 'lucide-react';

const LeadImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
      // Aqui você pode adicionar lógica para ler o CSV/Excel ou enviar ao backend
    }
  };

  return (
    <MainLayout title="Importação de Leads">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Importar Leads</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Upload de CSV ou Excel</CardTitle>
            <CardDescription>
              Importe uma lista de leads de um arquivo CSV ou Excel (.xlsx)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={handleUploadClick}
            >
              <div className="flex justify-center mb-4">
                <ArrowUpCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Arraste seu arquivo aqui</h3>
              <p className="text-muted-foreground mb-4">
                ou clique para selecionar de seu computador
              </p>

              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv, .xls, .xlsx"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <Button variant="outline" onClick={handleUploadClick}>
                <FileUp className="h-4 w-4 mr-2" />
                Selecionar arquivo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LeadImport;
