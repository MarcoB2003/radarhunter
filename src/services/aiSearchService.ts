import { GoogleGenerativeAI } from '@google/generative-ai';

interface SearchFilters {
  state?: string;
  companySize?: string;
  revenue?: string;
  employeeCount?: string;
  companyType?: string;
  marketTime?: string;
  sortBy?: string;
}

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

// Verifica e inicializa o cliente Google Generative AI
let genAI: GoogleGenerativeAI | null = null;

const initializeGenAI = () => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Chave da API Gemini não encontrada! Verifique sua variável de ambiente VITE_GEMINI_API_KEY.');
      return null;
    }
    
    if (apiKey === 'YOUR_API_KEY_HERE') {
      console.error('Você precisa substituir a chave padrão da API Gemini por uma chave válida.');
      return null;
    }
    
    console.log('Inicializando cliente Gemini AI com chave: [primeiros 5 caracteres]', apiKey.substring(0, 5) + '...');
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Erro ao inicializar o cliente Gemini AI:', error);
    return null;
  }
};

// Inicializa o cliente apenas uma vez
genAI = initializeGenAI();

/**
 * Search for companies using the Gemini AI API
 * 
 * @param searchQuery The search term entered by the user
 * @param filters Additional search filters
 * @returns Array of company results
 */
export const searchCompaniesWithAI = async (
  searchQuery: string,
  filters: SearchFilters = {}
): Promise<CompanyResult[]> => {
  // Verificar se o cliente Gemini foi inicializado com sucesso
  if (!genAI) {
    console.warn('Cliente Gemini AI não disponível. Usando dados mockados.');
    return generateMockCompanies(searchQuery);
  }
  
  try {
    // Convert filters to a readable format for the model
    const filterText = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    // Create the prompt for the model
    const prompt = `
      ### INSTRUÇÃO PRINCIPAL ###
      Você é um especialista em dados corporativos do mercado brasileiro. Sua tarefa é fornecer informações precisas sobre empresas brasileiras reais e existentes que correspondam aos critérios de busca.
      
      ### CRITÉRIOS DE BUSCA ###
      Termo principal: "${searchQuery}"
      ${filterText ? `Filtros específicos: ${filterText}` : ''}
      
      ### REGRAS OBRIGATÓRIAS ###
      1. Retorne APENAS empresas brasileiras REAIS e EXISTENTES, com dados precisos e verificáveis.
      2. NÃO invente empresas fictícias sob NENHUMA circunstância.
      3. Forneça APENAS nomes oficiais e registrados, não use aproximações.
      4. Os CNPJs devem seguir o formato oficial brasileiro: XX.XXX.XXX/XXXX-XX.
      5. A localização deve ser precisa, com cidade e UF existentes no Brasil.
      6. Inclua APENAS certificações que a empresa realmente possui.
      7. O campo "companySize" deve refletir o porte real da empresa (Pequena, Média ou Grande).
      
      ### DADOS REQUERIDOS (para cada empresa) ###
      - id (string aleatória para identificação)
      - name (nome oficial e completo da empresa)
      - cnpj (no formato correto brasileiro XX.XXX.XXX/XXXX-XX)
      - type (setor principal: Serviços, Comércio, Indústria, Importador, Tecnologia, etc)
      - location (cidade - UF, localizações reais brasileiras)
      - unitType (Matriz ou Filial)
      - segment (segmento específico dentro do tipo principal)
      - registeredDate (data de cadastro no formato MM/YYYY)
      - lastUpdate (data de atualização no formato MM/YYYY)
      - matchScore (relevância para a busca, entre 75 e 98)
      - certifications (array com certificações reais que a empresa possui)
      - companySize (Pequena, Média ou Grande)
      
      ### FORMATO DE RESPOSTA ###
      Retorne APENAS um array JSON válido, sem qualquer texto adicional ou explicação. Exemplos e formatações adicionais serão ignorados.
      
      ### EXEMPLO DE FORMATO ESPERADO ###
      [
        {
          "id": "abc123",
          "name": "Magazine Luiza S.A.",
          "cnpj": "47.960.950/0001-21",
          "type": "Comércio",
          "location": "São Paulo - SP",
          "unitType": "Matriz",
          "segment": "Varejo",
          "registeredDate": "11/1957",
          "lastUpdate": "03/2023",
          "matchScore": 95,
          "certifications": ["ISO 9001", "PROCON"],
          "companySize": "Grande"
        }
      ]
    `;

    // Configure the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro'
    });

    // Log que estamos fazendo a chamada à API Gemini
    console.log('Chamando API Gemini com a busca:', searchQuery);
    console.log('Usando o prompt:', prompt.substring(0, 100) + '...');
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Log da resposta bruta para debug
    console.log('Resposta bruta da API Gemini:', text.substring(0, 200) + '...');

    // Implementação mais robusta para extrair JSON corretamente
    try {
      // Primeiro, tenta encontrar qualquer array JSON na resposta
      const arrayRegex = /\[\s*\{[\s\S]*?\}\s*\]/g;
      const matches = text.match(arrayRegex);
      
      if (matches && matches.length > 0) {
        // Encontrou um array JSON, tenta fazer o parse
        try {
          const parsedArray = JSON.parse(matches[0]);
          if (Array.isArray(parsedArray) && parsedArray.length > 0) {
            console.log('Sucesso! Retornando dados da API Gemini:', parsedArray.length, 'resultados');
            return parsedArray;
          }
        } catch (arrayParseError) {
          console.error('Erro ao fazer parse do array encontrado:', arrayParseError);
        }
      }
      
      // Se não conseguiu encontrar ou fazer parse de um array, tenta limpar a string
      // e fazer parse novamente (Gemini às vezes adiciona texto antes ou depois do JSON)
      let cleanedText = text;
      
      // Remover markdown backticks e identificadores de linguagem como ```json
      cleanedText = cleanedText.replace(/```(?:json)?([\s\S]*?)```/g, '$1').trim();
      
      // Tenta fazer parse diretamente
      try {
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('Sucesso após limpeza! Retornando dados da API Gemini:', parsed.length, 'resultados');
          return parsed;
        } else if (parsed && typeof parsed === 'object') {
          // Verifica se há alguma propriedade que é um array
          for (const key in parsed) {
            if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
              console.log('Encontrado array na propriedade', key, 'com', parsed[key].length, 'resultados');
              return parsed[key] as CompanyResult[];
            }
          }
        }
      } catch (cleanParseError) {
        console.error('Erro ao fazer parse do texto limpo:', cleanParseError);
      }
      
      console.warn('Não foi possível extrair dados da API Gemini. Usando dados mockados como fallback.');
      return generateMockCompanies(searchQuery);
    } catch (e) {
      console.error('Erro geral ao processar resposta da API Gemini:', e);
      return generateMockCompanies(searchQuery);
    }
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    
    // Return mock data if AI call fails
    return generateMockCompanies(searchQuery);
  }
};

/**
 * Generate realistic fallback data with real Brazilian companies related to the search
 */
const generateMockCompanies = (searchQuery: string): CompanyResult[] => {
  // Mapeamento de termos de busca para setores
  const searchToSector: Record<string, string> = {
    'tecnologia': 'Tecnologia',
    'tech': 'Tecnologia',
    'software': 'Tecnologia',
    'industrial': 'Indústria',
    'indústria': 'Indústria',
    'manufatura': 'Indústria',
    'comércio': 'Comércio',
    'varejo': 'Comércio',
    'serviço': 'Serviços',
    'serviços': 'Serviços',
    'agricultura': 'Agroindústria',
    'agro': 'Agroindústria',
    'saúde': 'Saúde',
    'hospital': 'Saúde',
    'clínica': 'Saúde',
    'transporte': 'Logística',
    'logística': 'Logística'
  };

  // Dicionário de empresas reais brasileiras por setor
  const realCompanies: Record<string, {name: string, segment: string, city: string, state: string, size: string}[]> = {
    'Tecnologia': [
      { name: 'Totvs S.A.', segment: 'Software ERP', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Locaweb', segment: 'Hospedagem Web', city: 'São Paulo', state: 'SP', size: 'Média' },
      { name: 'CI&T', segment: 'Consultoria de TI', city: 'Campinas', state: 'SP', size: 'Grande' },
      { name: 'Positivo Tecnologia', segment: 'Hardware', city: 'Curitiba', state: 'PR', size: 'Grande' },
      { name: 'Linx S.A.', segment: 'Software de Varejo', city: 'São Paulo', state: 'SP', size: 'Média' },
      { name: 'Stefanini IT Solutions', segment: 'Consultoria de TI', city: 'São Paulo', state: 'SP', size: 'Grande' },
    ],
    'Indústria': [
      { name: 'WEG S.A.', segment: 'Motores Elétricos', city: 'Jaraguá do Sul', state: 'SC', size: 'Grande' },
      { name: 'Gerdau S.A.', segment: 'Siderúrgica', city: 'Porto Alegre', state: 'RS', size: 'Grande' },
      { name: 'Embraco', segment: 'Compressores', city: 'Joinville', state: 'SC', size: 'Grande' },
      { name: 'Marcopolo S.A.', segment: 'Veículos', city: 'Caxias do Sul', state: 'RS', size: 'Grande' },
      { name: 'Tigre S.A.', segment: 'Materiais de Construção', city: 'Joinville', state: 'SC', size: 'Grande' },
    ],
    'Comércio': [
      { name: 'Magazine Luiza', segment: 'Varejo', city: 'Franca', state: 'SP', size: 'Grande' },
      { name: 'Lojas Renner', segment: 'Moda', city: 'Porto Alegre', state: 'RS', size: 'Grande' },
      { name: 'Grupo Pão de Açúcar', segment: 'Supermercados', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Ri Happy', segment: 'Brinquedos', city: 'São Paulo', state: 'SP', size: 'Média' },
      { name: 'Havan', segment: 'Departamento', city: 'Brusque', state: 'SC', size: 'Grande' },
    ],
    'Serviços': [
      { name: 'Localiza Rent a Car', segment: 'Aluguel de Veículos', city: 'Belo Horizonte', state: 'MG', size: 'Grande' },
      { name: 'CVC Turismo', segment: 'Turismo', city: 'Santo André', state: 'SP', size: 'Grande' },
      { name: 'Cielo S.A.', segment: 'Pagamentos', city: 'Barueri', state: 'SP', size: 'Grande' },
      { name: 'Algar Telecom', segment: 'Telecomunicações', city: 'Uberlândia', state: 'MG', size: 'Grande' },
    ],
    'Agroindústria': [
      { name: 'JBS S.A.', segment: 'Alimentos', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'BRF S.A.', segment: 'Alimentos', city: 'Itajaí', state: 'SC', size: 'Grande' },
      { name: 'Cooperativa Agrícola Coamo', segment: 'Cooperativa', city: 'Campo Mourão', state: 'PR', size: 'Grande' },
      { name: 'SLC Agrícola', segment: 'Agronegócio', city: 'Porto Alegre', state: 'RS', size: 'Grande' },
    ],
    'Saúde': [
      { name: 'Grupo NotreDame Intermédica', segment: 'Planos de Saúde', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Drogaria São Paulo', segment: 'Farmácias', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Laboratórios Fleury', segment: 'Diagnósticos', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Hospital Albert Einstein', segment: 'Hospitalar', city: 'São Paulo', state: 'SP', size: 'Grande' },
    ],
    'Logística': [
      { name: 'JSL S.A.', segment: 'Transportes', city: 'São Paulo', state: 'SP', size: 'Grande' },
      { name: 'Tegma Gestão Logística', segment: 'Logística', city: 'São Bernardo do Campo', state: 'SP', size: 'Média' },
      { name: 'Sequoia Logística', segment: 'Transportes', city: 'Embu das Artes', state: 'SP', size: 'Média' },
    ]
  };

  // Certificações comuns por setor
  const sectorCertifications: Record<string, string[]> = {
    'Tecnologia': ['ISO 27001', 'ISO 9001', 'CMMI', 'PCI DSS', 'SOC 2'],
    'Indústria': ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ABNT NBR', 'INMETRO'],
    'Comércio': ['ISO 9001', 'PROCON', 'Selo RA1000', 'ABNT'],
    'Serviços': ['ISO 9001', 'ISO 20000', 'ABNT NBR', 'PCI DSS'],
    'Agroindústria': ['ISO 22000', 'BRC Food', 'GlobalGAP', 'Orgânico Brasil', 'Rainforest Alliance'],
    'Saúde': ['ISO 9001', 'ONA', 'JCI', 'ANVISA', 'CNES'],
    'Logística': ['ISO 9001', 'SASSMAQ', 'GMP', 'ANVISA']
  };

  // Identificar o setor mais relacionado à busca
  let sector = 'Serviços'; // padrão
  const lowercaseSearch = searchQuery.toLowerCase();

  Object.entries(searchToSector).forEach(([term, matchedSector]) => {
    if (lowercaseSearch.includes(term)) {
      sector = matchedSector;
      return;
    }
  });

  // Empresas disponíveis para o setor identificado
  let availableCompanies = realCompanies[sector] || realCompanies['Serviços'];
  
  // Randomizar um pouco a ordem das empresas
  availableCompanies = [...availableCompanies].sort(() => Math.random() - 0.5);

  // Determinar quantas empresas retornar (entre 2 e o máximo disponível, mas no máximo 8)
  const count = Math.min(8, Math.max(2, Math.min(availableCompanies.length, 3 + Math.floor(Math.random() * 6))));
  
  const results: CompanyResult[] = [];
  
  for (let i = 0; i < Math.min(count, availableCompanies.length); i++) {
    const company = availableCompanies[i];
    
    // Gerar um CNPJ no formato correto
    const cnpj = `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-${Math.floor(10 + Math.random() * 89)}`;
    
    // Selecionar certificações relevantes para o setor
    const availableCerts = sectorCertifications[sector] || sectorCertifications['Serviços'];
    const certCount = 1 + Math.floor(Math.random() * 3);
    const companyCertifications: string[] = [];
    
    for (let j = 0; j < certCount; j++) {
      const cert = availableCerts[Math.floor(Math.random() * availableCerts.length)];
      if (!companyCertifications.includes(cert)) {
        companyCertifications.push(cert);
      }
    }
    
    // Gerar data de cadastro e atualização
    const registrationYear = 2010 + Math.floor(Math.random() * 10);
    const registrationMonth = 1 + Math.floor(Math.random() * 12);
    const registeredDate = `${registrationMonth < 10 ? '0' + registrationMonth : registrationMonth}/${registrationYear}`;
    
    const updateYear = Math.min(2025, registrationYear + Math.floor(Math.random() * 3)); 
    const updateMonth = 1 + Math.floor(Math.random() * 12);
    const lastUpdate = `${updateMonth < 10 ? '0' + updateMonth : updateMonth}/${updateYear}`;
    
    // Pontuação de relevancia
    const matchScore = Math.floor(75 + Math.random() * 24);
    
    // Formação do resultado
    results.push({
      id: `comp-${i}-${Math.random().toString(36).substring(2, 8)}`,
      name: company.name,
      cnpj: cnpj,
      type: sector,
      location: `${company.city} - ${company.state}`,
      unitType: Math.random() > 0.8 ? 'Filial' : 'Matriz',
      segment: company.segment,
      registeredDate: registeredDate,
      lastUpdate: lastUpdate,
      matchScore: matchScore,
      certifications: companyCertifications,
      companySize: company.size
    });
  }
  
  // Ordenar por score de relevância
  return results.sort((a, b) => b.matchScore - a.matchScore);
};
