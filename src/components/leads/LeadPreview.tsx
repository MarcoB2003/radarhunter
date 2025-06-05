import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { LeadFormData } from '@/types/lead';

interface LeadPreviewProps {
  leads: LeadFormData[];
  onImport: () => void;
  onClose: () => void;
}

export function LeadPreview({ leads, onImport, onClose }: LeadPreviewProps) {
  const { toast } = useToast();

  if (!leads || leads.length === 0) return null;

  const totalLeads = leads.length;
  const validLeads = leads.filter(lead => lead.name && lead.email).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Preview dos Leads</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de leads: {totalLeads}
              </p>
              <p className="text-sm text-green-600">
                Leads válidos: {validLeads}
              </p>
            </div>
            <Button onClick={onImport} disabled={validLeads === 0}>
              Importar {validLeads} leads
            </Button>
          </div>
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
              {leads.map((lead, index) => (
                <TableRow
                  key={index}
                  className={
                    !lead.name || !lead.email ? "bg-destructive/5" : ""
                  }
                >
                  <TableCell>{lead.name || "-"}</TableCell>
                  <TableCell>{lead.email || "-"}</TableCell>
                  <TableCell>{lead.phone || "-"}</TableCell>
                  <TableCell>{lead.company || "-"}</TableCell>
                  <TableCell>{lead.position || "-"}</TableCell>
                  <TableCell>{lead.platform || "-"}</TableCell>
                  <TableCell>{lead.status || "Novo"}</TableCell>
                  <TableCell>{lead.engagement_score || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
