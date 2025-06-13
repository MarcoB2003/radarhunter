import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MapPin, 
  Users, 
  Building, 
  ChevronDown,
  FileText,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Company {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  state: string;
  employees: string;
  cnpj: string;
  leadStatus: 'Quente' | 'Morno' | 'Frio';
  createdDate?: string;
  createdBy?: string;
}

const Companies: React.FC = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Sample data
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'DigShop',
      description: 'Varejo Digital Ltda',
      location: 'Brasília, DF',
      city: 'Brasília',
      state: 'DF',
      employees: '50-100 funcionários',
      cnpj: '67.890.123/0001-45',
      leadStatus: 'Quente',
      createdDate: '30/04/2025',
      createdBy: 'Pedro Santos'
    },
    {
      id: '2',
      name: 'EduOn',
      description: 'Educação Online Eireli',
      location: 'Salvador, BA',
      city: 'Salvador',
      state: 'BA',
      employees: '20-50 funcionários',
      cnpj: '89.012.345/0001-67',
      leadStatus: 'Morno',
      createdDate: '18/04/2025',
      createdBy: 'Radar IA por Radar IA'
    },
    {
      id: '3',
      name: 'FinCon',
      description: 'Consultoria Financeira S.A.',
      location: 'Florianópolis, SC',
      city: 'Florianópolis',
      state: 'SC',
      employees: '20-50 funcionários',
      cnpj: '78.901.234/0001-56',
      leadStatus: 'Frio',
      createdDate: '25/04/2025',
      createdBy: 'João Silva'
    },
    {
      id: '4',
      name: 'NaturFood',
      description: 'Alimentos Naturais S.A.',
      location: 'Porto Alegre, RS',
      city: 'Porto Alegre',
      state: 'RS',
      employees: '100-200 funcionários',
      cnpj: '56.789.012/0001-34',
      leadStatus: 'Quente',
    },
    {
      id: '5',
      name: 'LogEx',
      description: 'Logística Express Eireli',
      location: 'Rio de Janeiro, RJ',
      city: 'Rio de Janeiro',
      state: 'RJ',
      employees: '100-200 funcionários',
      cnpj: '23.456.789/0001-01',
      leadStatus: 'Morno',
    },
    {
      id: '6',
      name: 'SaudeBem',
      description: 'Saúde & Bem-estar S.A.',
      location: 'Belo Horizonte, MG',
      city: 'Belo Horizonte',
      state: 'MG',
      employees: '200-300 funcionários',
      cnpj: '34.567.890/0001-12',
      leadStatus: 'Frio',
    },
  ];

  // Filter companies by lead status
  const hotLeads = mockCompanies.filter(company => company.leadStatus === 'Quente');
  const warmLeads = mockCompanies.filter(company => company.leadStatus === 'Morno');
  const coldLeads = mockCompanies.filter(company => company.leadStatus === 'Frio');

  // Filter companies by search query
  const filterCompanies = (companies: Company[]) => {
    if (!searchQuery) return companies;
    
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Company Card Component
  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    return (
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.description}</p>
            </div>
            <Badge 
              className={
                company.leadStatus === 'Quente' ? 'bg-red-100 text-red-700' :
                company.leadStatus === 'Morno' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }
            >
              {company.leadStatus}
            </Badge>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>{company.employees}</span>
            </div>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-gray-500" />
              <span>CNPJ: {company.cnpj}</span>
            </div>
            {company.createdBy && (
              <div className="text-xs text-gray-500">
                Entrada Manual por {company.createdBy} • {company.createdDate}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col space-y-2">
            <Button 
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              size="sm">
                Ativar IA SDR
            </Button>
            <div className="flex justify-between gap-2">
              <Button 
                className="flex-1" 
                variant="outline" 
                size="sm">
                  Ver Detalhes
              </Button>
              <Button 
                className="flex-1" 
                variant="outline" 
                size="sm">
                  Incluir na Base de Dados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout title="Empresas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Empresas</h1>
            <p className="text-gray-500 text-sm">Gerencie e analise todas as empresas mapeadas</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exportar Relatório
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Empresa
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Nova Busca
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todos os Leads</TabsTrigger>
            <TabsTrigger value="mine">Meus Leads Inseridos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, segmento, cidade..." 
              className="pl-10" 
            />
          </div>

          <Select value={orderBy} onValueChange={setOrderBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{orderBy || "Ordenar"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
              <SelectItem value="date_new">Mais recente</SelectItem>
              <SelectItem value="date_old">Mais antigo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Quente */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <h2 className="font-medium text-lg">Quente ({filterCompanies(hotLeads).length})</h2>
            </div>
            <div className="space-y-4">
              {filterCompanies(hotLeads).map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>

          {/* Coluna Morno */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h2 className="font-medium text-lg">Morno ({filterCompanies(warmLeads).length})</h2>
            </div>
            <div className="space-y-4">
              {filterCompanies(warmLeads).map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>

          {/* Coluna Frio */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="font-medium text-lg">Frio ({filterCompanies(coldLeads).length})</h2>
            </div>
            <div className="space-y-4">
              {filterCompanies(coldLeads).map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Companies;
