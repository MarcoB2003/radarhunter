import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ImportPreviewProps {
  leads: Record<string, any>[];
  onClose: () => void;
}

export function ImportPreview({ leads, onClose }: ImportPreviewProps) {
  const [showPreview, setShowPreview] = useState(true);

  if (!showPreview) return null;

  return (
    <div className="mt-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Preview dos Leads Importados</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead, index) => {
                  const REQUIRED_FIELDS = ['name', 'email', 'phone', 'company', 'position', 'platform', 'status', 'engagement_score'];
                  const missingFields = REQUIRED_FIELDS.filter(field => {
                    // Verifica se o campo existe e não está vazio
                    const value = lead[field];
                    return !value || (typeof value === 'string' && value.trim() === '');
                  });
                  const isIncomplete = missingFields.length > 0;
                  
                  return (
                    <TableRow 
                      key={index} 
                      className=""
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lead.name || "-"}
                          {isIncomplete && (
                            <div className="relative">
                              <X className="text-destructive w-4 h-4" />
                              <div className="absolute -top-6 left-0 bg-background/90 text-destructive rounded px-2 py-1 text-xs whitespace-nowrap">
                                Faltando: {missingFields.join(', ')}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lead.email || "-"}</TableCell>
                      <TableCell>{lead.phone || "-"}</TableCell>
                      <TableCell>{lead.company || "-"}</TableCell>
                      <TableCell>{lead.position || "-"}</TableCell>
                      <TableCell>{lead.platform || "-"}</TableCell>
                      <TableCell>{lead.status || "-"}</TableCell>
                      <TableCell>{lead.engagement_score || "0"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
