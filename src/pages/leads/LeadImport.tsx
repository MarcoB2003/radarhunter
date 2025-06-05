import React, { useRef, useState, useEffect } from 'react';
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
import { ArrowUpCircle, FileUp, FolderOpen } from 'lucide-react';
import { processFile, getSupportedFileTypes, SUPPORTED_FILE_TYPES, validateAndConvertLead, validateLead, createExcelTemplate } from '@/utils/fileProcessor';
import { generateLeadsWithMissingFieldsReport } from '@/utils/leadReport';
import * as XLSX from 'xlsx';
import { LeadFormData, PartialLeadData } from '@/types/lead';
import { supabaseService } from '@/services/supabaseService';

interface LeadWithValidation {
  lead: Record<string, any>;
  missingFields: string[];
  index: number;
}

interface ImportedFile {
  id: string;
  name: string;
  created_at: string;
}

import { ImportPreview } from '@/components/leads/ImportPreview';
import { useToast } from '@/components/ui/use-toast';

const createFileList = (files: File[]) => {
  const fileList = new DataTransfer();
  files.forEach(file => fileList.items.add(file));
  return fileList.files;
};

const LeadImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [importedLeads, setImportedLeads] = useState<LeadFormData[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    const workbook = createExcelTemplate();
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    });

    // Criar blob e URL
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    
    // Criar e disparar download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_leads.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.preventDefault();
    event.stopPropagation();

    setUploading(true);
    try {
      const fileType = file.type;
      
      if (!Object.values(SUPPORTED_FILE_TYPES).includes(fileType)) {
        toast({
          title: "Erro",
          description: `Formato de arquivo não suportado. Tipos suportados: ${Object.values(SUPPORTED_FILE_TYPES)
            .map(type => type as string)
            .map(type => type.split('/')[1])
            .join(', ')}.`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Processando arquivo",
        description: `Lendo dados do arquivo ${file.name}...`,
        duration: 5000,
      });

      const leads = await processFile(file);
      
      if (!leads || leads.length === 0) {
        throw new Error('Nenhum lead encontrado no arquivo');
      }

      // Processar leads e coletar informações sobre campos faltantes
      const processedLeads: LeadWithValidation[] = leads.map((lead: Record<string, any>, index) => {
        const validation = validateLead(lead);
        return {
          lead,
          missingFields: validation.missingFields || [],
          index: index + 1
        };
      }); // Remove nulls

      // Limpar o input de arquivo
      event.target.value = '';

      // Atualizar estado e mostrar preview
      setImportedLeads(leads);
      setShowImportPreview(true);

      toast({
        title: "Sucesso",
        description: `Encontrados ${leads.length} leads válidos para importação`,
      });

      // Gerar relatório dos leads com campos faltantes
      const leadsWithMissingFields = processedLeads.filter((lead: LeadWithValidation) => lead.missingFields.length > 0);
      if (leadsWithMissingFields.length > 0) {
        const report = generateLeadsWithMissingFieldsReport(leadsWithMissingFields);
        const blob = new Blob([report], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'leads_com_campos_faltantes.csv';
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Relatório gerado",
          description: `Foram encontrados ${leadsWithMissingFields.length} leads com campos faltantes. ` +
             "O relatório foi gerado mostrando quais campos estão faltando em cada lead.",
          variant: "default",
        });
      }
    } catch (error) {
      // Coletar erros de validação
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar arquivo";
      
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Salvar leads no Supabase
      try {
        await supabaseService.saveLeads(importedLeads);
        
        // Salvar arquivo de importação
        const fileName = fileInputRef.current?.files?.[0].name;
        await supabaseService.saveImportedFile(fileName);
        
        // Atualizar lista de arquivos
        loadImportedFiles();
        
        toast({
          title: "Sucesso",
          description: `Leads importados e salvos com sucesso!`,
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar os dados no banco",
          variant: "destructive",
        });
      }
      setUploading(false);
    }
  };

  useEffect(() => {
    // Carregar arquivos de importação ao montar o componente
    loadImportedFiles();
  }, []);

  const loadImportedFiles = async () => {
    try {
      const files = await supabaseService.listImportedFiles();
      setImportedFiles(files);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    }
  };

  const handleFileClick = async (fileId: string) => {
    try {
      const leads = await supabaseService.getLeadsByFileId(fileId);
      setImportedLeads(leads);
      setShowImportPreview(true);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads deste arquivo",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout title="Importação de Leads">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Importar Leads</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <FileUp className="mr-2 h-4 w-4" />
              Baixar Modelo
            </Button>
            <Button variant="outline" onClick={() => setShowImportPreview(false)}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Arquivos Importados
            </Button>
          </div>
        </div>

        {importedFiles.length > 0 && !showImportPreview && (
          <Card>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">Arquivos Importados</h3>
                {importedFiles.map(file => (
                  <Button
                    key={file.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleFileClick(file.id)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {file.name} - {new Date(file.created_at).toLocaleDateString()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const event = new Event('change', { bubbles: true });
                  const input = fileInputRef.current;
                  if (input) {
                    input.files = createFileList([file]);
                    input.dispatchEvent(event);
                  }
                }
              }}
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

        {showImportPreview && (
          <ImportPreview
            leads={importedLeads}
            onClose={() => setShowImportPreview(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default LeadImport;
