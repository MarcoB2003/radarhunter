import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, Bell, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Contact {
  name: string;
  role: string;
  company: string;
  activity: string;
  platform: 'linkedin' | 'twitter' | 'facebook';
  time: string;
  alert: string;
  alertColor: string;
  status: string;
  statusColor: string;
  engagement: number;
}

const SocialMonitoringDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('engagement');

  const activeContacts: Contact[] = [
    {
      name: 'João Silva',
      role: 'Diretor de Tecnologia',
      company: 'TechSol',
      activity: 'Post',
      platform: 'linkedin',
      time: '2h atrás',
      alert: 'Publicado hoje',
      alertColor: 'bg-green-200 text-green-800',
      status: 'Conectado',
      statusColor: 'bg-green-100 text-green-700',
      engagement: 84
    },
    {
      name: 'Maria Souza',
      role: 'CEO',
      company: 'LogEx',
      activity: 'Artigo',
      platform: 'twitter',
      time: '1d atrás',
      alert: 'Interagiu com concorrente',
      alertColor: 'bg-orange-200 text-orange-800',
      status: 'Pendente',
      statusColor: 'bg-yellow-100 text-yellow-800',
      engagement: 72
    },
    {
      name: 'Pedro Santos',
      role: 'Diretor Comercial',
      company: 'SaudeBem',
      activity: 'Compartilhamento',
      platform: 'linkedin',
      time: '3h atrás',
      alert: 'Promovido recentemente',
      alertColor: 'bg-blue-200 text-blue-800',
      status: 'Não conectado',
      statusColor: 'bg-gray-200 text-gray-800',
      engagement: 65
    },
    {
      name: 'Ana Oliveira',
      role: 'Diretora de Operações',
      company: 'UrbanCon',
      activity: 'Post',
      platform: 'facebook',
      time: '5h atrás',
      alert: 'Ativo na sua indústria',
      alertColor: 'bg-purple-200 text-purple-800',
      status: 'Conectado',
      statusColor: 'bg-green-100 text-green-700',
      engagement: 68
    },
    {
      name: 'Carlos Pereira',
      role: 'Diretor Financeiro',
      company: 'NaturFood',
      activity: 'Comentário',
      platform: 'linkedin',
      time: '1d atrás',
      alert: 'Alto engajamento',
      alertColor: 'bg-teal-200 text-teal-800',
      status: 'Conectado',
      statusColor: 'bg-green-100 text-green-700',
      engagement: 90
    },
  ];

  const filteredContacts = activeContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    const matchesPlatform = selectedPlatform === 'all' || contact.platform === selectedPlatform;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === 'engagement') {
      return b.engagement - a.engagement;
    } else {
      return a.status.localeCompare(b.status);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Social Selling com IA
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Input
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alertas de Atividade
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Status</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Conectado">Conectado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Não conectado">Não conectado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Plataforma</label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Ordenar por</label>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engajamento (maior)</SelectItem>
                <SelectItem value="status">Status (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Cargo</th>
              <th className="py-2 px-3">Empresa</th>
              <th className="py-2 px-3">Última Atividade</th>
              <th className="py-2 px-3">Alertas</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Engajamento</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact, index) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                <td className="py-2 px-3">{contact.name}</td>
                <td className="py-2 px-3">{contact.role}</td>
                <td className="py-2 px-3">{contact.company}</td>
                <td className="py-2 px-3 flex items-center gap-2">
                  <span>{contact.time}</span>
                  <Badge variant="outline">{contact.activity}</Badge>
                  {contact.platform === 'linkedin' && <Linkedin className="h-4 w-4" />}
                  {contact.platform === 'twitter' && <Twitter className="h-4 w-4" />}
                  {contact.platform === 'facebook' && <Facebook className="h-4 w-4" />}
                </td>
                <td className="py-2 px-3"><Badge className={contact.alertColor}>{contact.alert}</Badge></td>
                <td className="py-2 px-3"><Badge className={contact.statusColor}>{contact.status}</Badge></td>
                <td className="py-2 px-3 font-semibold text-right">{contact.engagement}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default SocialMonitoringDashboard;
