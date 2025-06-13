import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Define the empresa type
export interface EmpresaData {
  id?: string;
  razao_social: string;
  cnpj?: string;
  contato_principal?: string;
  email_1?: string;
  email_2?: string;
  email_3?: string;
  telefone_contato_principal?: string;
  cargo_contato?: string;
  site_empresa?: string;
  segmento?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
}

interface EmpresaPreviewProps {
  empresas: EmpresaData[];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

// Função para limpar texto de caracteres especiais (remover acentos e caracteres não permitidos)
const cleanText = (text: string | undefined): string => {
  if (!text) return '-';
  try {
    return text.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s\-_.]/g, '');
  } catch {
    return text;
  }
};

export function EmpresaPreview({ empresas, open, onClose, onConfirm, isLoading }: EmpresaPreviewProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Pré-visualização da Importação</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[450px] w-full rounded-md border" type="always">
          <div className="w-full min-w-[800px]">
            {/* Cabeçalho da Tabela */}
            <div className="bg-muted sticky top-0 z-10 grid grid-cols-8 gap-4 px-4 py-3 font-medium text-sm">
              <div className="text-left">Razão Social</div>
              <div className="text-left">CNPJ</div>
              <div className="text-left">Contato Principal</div>
              <div className="text-left">Email Principal</div>
              <div className="text-left">Telefone</div>
              <div className="text-left">Cargo</div>
              <div className="text-left">Cidade/Estado</div>
              <div className="text-left">Segmento</div>
            </div>
            
            {/* Linhas de Dados */}
            {empresas.length > 0 ? empresas.map((empresa, index) => (
              <div 
                key={index} 
                className="grid grid-cols-8 gap-4 px-4 py-3 border-b hover:bg-muted/50 transition-colors"
              >
                <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={cleanText(empresa.razao_social)}>
                  {cleanText(empresa.razao_social)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.cnpj)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.contato_principal)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.email_1)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.telefone_contato_principal)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.cargo_contato)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.cidade)}{empresa.cidade && empresa.estado ? '/' : ''}{cleanText(empresa.estado)}
                </div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {cleanText(empresa.segmento)}
                </div>
              </div>
            )) : (
              <div className="flex justify-center items-center py-8 text-muted-foreground">
                Nenhuma empresa encontrada no arquivo
              </div>
            )}
            </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="text-sm text-muted-foreground mt-2">
          Total de empresas: {empresas.length}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Importando...' : 'Confirmar Importação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
