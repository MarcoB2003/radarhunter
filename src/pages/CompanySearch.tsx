import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Info, CheckCircle2, Clock, Award, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { searchCompaniesWithAI } from '@/services/aiSearchService';
import { useToast } from "@/components/ui/use-toast";

interface CompanyResult {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  location: string;
  unitType: string;
  segment: string;
  registeredDate: string;
  lastUpdate: string;
  matchScore: number;
  certifications: string[];
  companySize?: string;
}

const CompanySearch: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CompanyResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [state, setState] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [revenue, setRevenue] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [marketTime, setMarketTime] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe um termo de busca.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await searchCompaniesWithAI(searchQuery, {
        state,
        companySize,
        revenue,
        employeeCount,
        companyType,
        marketTime,
        sortBy
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar empresas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <MainLayout title="Busca Inteligente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Busca Inteligente</h1>
          <p className="text-muted-foreground mt-2">
            Encontre empresas usando filtros avançados e IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-yellow-500" />
              <CardTitle>Buscador Inteligente</CardTitle>
            </div>
            <CardDescription>
              Digite segmento, nome da empresa ou palavras-chave para que nossa IA encontre empresas no mercado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Busca</label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite sua busca aqui..."
                  className="w-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="link"
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-0 h-auto text-blue-500"
                >
                  {showFilters ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
                </Button>

                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>Descobrir Empresas</>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Estado</label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Porte da Empresa</label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="Pequena">Pequena</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Faturamento Estimado</label>
                    <Select value={revenue} onValueChange={setRevenue}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="Até 500 mil">Até 500 mil</SelectItem>
                        <SelectItem value="500 mil - 2 milhões">500 mil - 2 milhões</SelectItem>
                        <SelectItem value="2 - 10 milhões">2 - 10 milhões</SelectItem>
                        <SelectItem value="Acima de 10 milhões">Acima de 10 milhões</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Número de Funcionários</label>
                    <Select value={employeeCount} onValueChange={setEmployeeCount}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-1000">201-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de Empresa</label>
                    <Select value={companyType} onValueChange={setCompanyType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Comércio">Comércio</SelectItem>
                        <SelectItem value="Indústria">Indústria</SelectItem>
                        <SelectItem value="Importador">Importador</SelectItem>
                        <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Tempo no Mercado</label>
                    <Select value={marketTime} onValueChange={setMarketTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer</SelectItem>
                        <SelectItem value="Menos de 2 anos">Menos de 2 anos</SelectItem>
                        <SelectItem value="2-5 anos">2-5 anos</SelectItem>
                        <SelectItem value="5-10 anos">5-10 anos</SelectItem>
                        <SelectItem value="Mais de 10 anos">Mais de 10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Ordenar por</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nome</SelectItem>
                        <SelectItem value="matchScore">Relevância</SelectItem>
                        <SelectItem value="registeredDate">Data de Registro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isSearching ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
          </div>
        ) : searchQuery && searchResults.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
              <Search className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Não encontramos empresas para "{searchQuery}". Tente outros termos ou filtros diferentes.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setShowFilters(true);
                setState('');
                setCompanySize('');
                setRevenue('');
                setCompanyType('');
              }}
              variant="outline"
              className="mt-4"
            >
              Limpar filtros e tentar novamente
            </Button>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">
              Encontramos {searchResults.length} resultados para "{searchQuery}"
            </h2>

            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700 flex items-start space-x-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Os dados externos são enriquecidos pela IA e podem ser importados para sua base.</p>
            </div>

            {/* Lista de segmentos encontrados */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Segmentos encontrados:</h3>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // Calcula os segmentos únicos e suas contagens
                  const segmentCounts: Record<string, number> = {};
                  searchResults.forEach(company => {
                    if (!segmentCounts[company.segment]) {
                      segmentCounts[company.segment] = 1;
                    } else {
                      segmentCounts[company.segment]++;
                    }
                  });
                  
                  // Retorna os badges para cada segmento
                  return Object.entries(segmentCounts).map(([segment, count]) => (
                    <Badge key={segment} variant="secondary">
                      {segment} ({count})
                    </Badge>
                  ));
                })()} 
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((company) => (
                <Card key={company.id} className="overflow-hidden">
                  <div className={`h-1 ${company.matchScore >= 90 ? 'bg-green-500' : company.matchScore >= 75 ? 'bg-blue-500' : 'bg-orange-500'}`} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.cnpj}</p>
                      </div>
                      <Badge className={`${company.matchScore >= 90 ? 'bg-green-100 text-green-800' : company.matchScore >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {company.matchScore}%
                      </Badge>
                    </div>

                    <div className="flex flex-col text-sm mt-4">
                      <div className="flex items-center gap-1 mb-1">
                        <Info className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-slate-700">{company.type}</span>
                        {company.companySize && (
                          <span className="text-slate-500 text-xs ml-1">• {company.companySize}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-slate-700">{company.location} ({company.unitType})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-slate-700">{company.segment}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">CNPJ raiz</p>
                        <p className="text-sm">{company.cnpj.substring(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cadastrado em</p>
                        <p className="text-sm">{company.registeredDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Atualizado em</p>
                        <p className="text-sm">{company.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">Certificações</p>
                      <div className="flex flex-wrap gap-1">
                        {company.certifications.map((cert, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="flex items-center gap-1 text-xs py-0"
                          >
                            <Award className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <Badge 
                        variant="outline" 
                        className={`${company.matchScore >= 90 ? 'text-green-600 border-green-200' : 'text-blue-600 border-blue-200'}`}
                      >
                        {company.matchScore >= 90 ? 'Qualificado' : 'Preferido'}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                        <Button size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-800">Já cadastrado</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default CompanySearch;
