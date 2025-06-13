import { useState } from 'react';
import { LeadList } from '@/components/leads/LeadList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, CheckCircle, Clock, FileText, Shield, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import { EmpresaPreview, EmpresaData } from '@/components/empresas/EmpresaPreview';
import { processEmpresaFile } from '@/utils/fileProcessorEmpresas';
import { useMutation } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase';

function LeadsPageContent() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [importedEmpresas, setImportedEmpresas] = useState<EmpresaData[]>([]);
  const [showEmpresaPreview, setShowEmpresaPreview] = useState(false);
  
  // Mutation for importing empresas
  const importEmpresasMutation = useMutation({
    mutationFn: (empresas: EmpresaData[]) => supabaseService.importEmpresas(empresas),
    onSuccess: () => {
      toast({
        title: "Importação concluída",
        description: `${importedEmpresas.length} empresas importadas com sucesso`,
      });
      setShowEmpresaPreview(false);
      setImportedEmpresas([]);
    },
    onError: (error) => {
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro ao importar empresas",
        variant: "destructive"
      });
    }
  });

  // Function to handle file uploads
  const handleFileUpload = async (file: File) => {
    // Check file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileType)) {
      toast({
        title: "Formato inválido",
        description: "Por favor envie um arquivo CSV ou Excel (.xlsx/.xls)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 10MB",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Process the file to extract empresa data
      const empresas = await processEmpresaFile(file);
      
      if (empresas.length === 0) {
        throw new Error("Nenhuma empresa encontrada no arquivo ou dados inválidos");
      }
      
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      
      // Clear progress after completion
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          // Show the preview after processing is complete
          setImportedEmpresas(empresas);
          setShowEmpresaPreview(true);
          
          toast({
            title: "Processamento concluído",
            description: `${empresas.length} empresas encontradas no arquivo`,
          });
        }, 500);
      }, 2000);
      
    } catch (error) {
      setUploading(false);
      setProgress(0);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Formato de arquivo inválido",
        variant: "destructive"
      });
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV content
    const csvContent = 'Empresa (Razão Social),CNPJ,Nome do Contato Principal,Email 1,Email 2,Email 3,Telefone Principal,Cargo do Contato,Website,Segmento,Estado,Observações\nEmpresa Exemplo LTDA,12345678000190,João Silva,joao@exemplo.com,,,11987654321,Diretor,www.exemplo.com.br,Tecnologia,SP,Cliente potencial';
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = 'modelo_importacao_leads.csv';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Import Header */}
      <div className="mb-8">
        <div className="flex items-center text-primary mb-2">
          <ArrowDown className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold">Importação Inteligente de Leads</h1>
        </div>
        <p className="text-muted-foreground">Importe, limpe e enriqueça sua base de leads automaticamente</p>
      </div>

      {/* Import Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-base font-semibold">Formato de arquivo</h3>
            </div>
            <p className="text-sm">Aceitamos CSV e Excel (.xlsx, .xls) com informações de empresas</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-amber-500" />
              <h3 className="font-semibold">Processamento</h3>
            </div>
            <p className="text-sm text-muted-foreground">Menos de 3 minutos para 1000 leads</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              <h3 className="font-semibold">Proteção LGPD</h3>
            </div>
            <p className="text-sm text-muted-foreground">Conformidade com normas de proteção</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-2xl font-semibold mb-2">Upload da Base de Leads</h2>
            <p className="text-muted-foreground mb-8">Carregue sua base de leads em formato .xlsx ou .csv</p>
            
            {/* Import Tips */}
            <div className="w-full bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2 text-blue-900">Dicas para uma importação bem-sucedida</h3>
              <ul className="list-disc pl-5 text-blue-800 space-y-1">
                <li>Use o formato do modelo para melhores resultados</li>
                <li>Verifique se os campos obrigatórios estão preenchidos</li>
                <li>O tamanho máximo do arquivo é 10MB</li>
                <li>Usamos IA para enriquecer dados ausentes ou incompletos</li>
              </ul>
            </div>

            {/* Upload Area */}
            <div 
              className={`w-full border-2 border-dashed ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} rounded-lg p-8 flex flex-col items-center justify-center`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
            >
              <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-lg font-medium mb-1">Clique ou arraste o arquivo</p>
                <p className="text-sm text-muted-foreground mb-4">Formatos suportados: .xlsx, .csv até 10MB</p>
                
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
              
              {uploading && (
                <div className="w-full mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center mt-2">{progress}% concluído</p>
                </div>
              )}
            </div>

            <div className="flex w-full justify-between mt-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleDownloadTemplate}
              >
                <ArrowDown className="h-4 w-4" />
                Baixar modelo
              </Button>
              <Button 
                disabled={uploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {uploading ? 'Processando...' : 'Selecionar arquivo'}
              </Button>
            </div>
          </div>
          
          {/* Benefits Section */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-yellow-500" />
              Benefícios da importação inteligente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-3">Limpeza automatizada</h3>
                <ul className="space-y-2">
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Remoção de duplicidades de CNPJ</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Correção de e-mails inválidos</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Padronização de telefones e contatos</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Enriquecimento com IA</h3>
                <ul className="space-y-2">
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Preenchimento automático de dados faltantes</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Classificação por segmento e porte</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Detecção de potencial comercial</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Auditoria e rastreabilidade</h3>
                <ul className="space-y-2">
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Log completo de todas as importações</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Relatório detalhado de modificações</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Conformidade com LGPD</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Agilidade operacional</h3>
                <ul className="space-y-2">
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Distribuição automática para SDRs</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Integração direta com o pipeline</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Exportação de relatórios completos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead List */}
      {/* Empresa Preview Dialog */}
      <EmpresaPreview 
        empresas={importedEmpresas}
        open={showEmpresaPreview}
        onClose={() => setShowEmpresaPreview(false)}
        onConfirm={() => importEmpresasMutation.mutate(importedEmpresas)}
        isLoading={importEmpresasMutation.isPending}
      />
      
      <LeadList />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <MainLayout title="Leads">
      <LeadsPageContent />
    </MainLayout>
  );
}
