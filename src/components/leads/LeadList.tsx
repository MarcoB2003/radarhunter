import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase';
import { LeadFormData } from '@/types/lead';
import { LeadStatus } from '@/types/leadStatus';
import { PartialLeadData } from '@/types/lead';
import { processFile, getSupportedFileTypes, SUPPORTED_FILE_TYPES } from '@/utils/fileProcessor';
import { Upload, X, ChevronUp } from 'lucide-react';
import { ImportPreview } from './ImportPreview';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function LeadList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [engagementOrder, setEngagementOrder] = useState<'asc' | 'desc'>('desc');
  const [uploading, setUploading] = useState(false);
  const [importedLeads, setImportedLeads] = useState<LeadFormData[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads', selectedPlatform, selectedStatus, engagementOrder],
    queryFn: () => 
      supabaseService.filterLeads(
        selectedPlatform,
        selectedStatus,
        engagementOrder
      ),
  });

  const updateLeadMutation = useMutation({
    mutationFn: (lead: { id: string; data: Partial<LeadFormData> }) => 
      supabaseService.updateLead(lead.id, lead.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Sucesso",
        description: "Lead atualizado com sucesso",
      });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => supabaseService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Sucesso",
        description: "Lead removido com sucesso",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prevenir o comportamento padrão do navegador
    e.preventDefault();
    e.stopPropagation();

    setUploading(true);
    try {
      const fileType = file.type;
      
      if (!Object.values(SUPPORTED_FILE_TYPES).includes(fileType)) {
        toast({
          title: "Erro",
          description: `Formato de arquivo não suportado. Tipos suportados: ${getSupportedFileTypes()}.`,
          variant: "destructive",
        });
        return;
      }

      // Processar o arquivo
      const leads = await processFile(file);
      
      if (!leads || leads.length === 0) {
        throw new Error('Nenhum lead encontrado no arquivo');
      }

      // Validar campos obrigatórios
      const requiredFields = ['name', 'email'];
      const hasInvalidLeads = leads.some(lead => 
        requiredFields.some(field => !lead[field])
      );

      if (hasInvalidLeads) {
        throw new Error('Arquivo inválido. Verifique se o formato está correto e contém os campos obrigatórios.');
      }

      // Limpar o input de arquivo
      e.target.value = '';

      // Atualizar estado e mostrar preview
      setImportedLeads(leads as LeadFormData[]);
      setShowImportPreview(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao processar arquivo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };



  if (!leads) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedPlatform}
            onValueChange={setSelectedPlatform}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Linkedin">Linkedin</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(value: LeadStatus) => setSelectedStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Novo">Novo</SelectItem>
              <SelectItem value="Em negociação">Em negociação</SelectItem>
              <SelectItem value="Ganhou">Ganhou</SelectItem>
              <SelectItem value="Perdeu">Perdeu</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setEngagementOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            Ordenar por pontuação
            <ChevronUp className={`ml-2 h-4 w-4 ${engagementOrder === 'asc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            disabled={uploading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Processando...' : 'Importar leads'}
            </label>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            className="hidden"
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || '-'}</TableCell>
                    <TableCell>{lead.company || '-'}</TableCell>
                    <TableCell>{lead.position || '-'}</TableCell>
                    <TableCell>{lead.platform}</TableCell>
                    <TableCell>
                      <Select
                        value={lead.status as LeadStatus}
                        onValueChange={(value: LeadStatus) =>
                          updateLeadMutation.mutate({ id: lead.id, data: { status: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Novo">Novo</SelectItem>
                          <SelectItem value="Em negociação">Em negociação</SelectItem>
                          <SelectItem value="Ganhou">Ganhou</SelectItem>
                          <SelectItem value="Perdeu">Perdeu</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={lead.engagement_score}
                        onChange={(e) =>
                          updateLeadMutation.mutate({
                            id: lead.id,
                            data: { engagement_score: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLeadMutation.mutate(lead.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Nenhum lead encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showImportPreview && (
        <ImportPreview
          leads={importedLeads}
          onClose={() => setShowImportPreview(false)}
        />
      )}
    </div>
  );
}
