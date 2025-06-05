import * as XLSX from 'xlsx';

export const createExcelTemplate = () => {
  // Definir os cabeçalhos
  const headers = [
    'Nome',
    'E-mail',
    'Telefone',
    'Empresa',
    'Cargo',
    'Plataforma',
    'Status',
    'Pontuação'
  ];

  // Criar o array de dados
  const data = [
    headers,
    [
      'Exemplo de Nome',
      'exemplo@email.com',
      '+55 11 99999-9999',
      'Empresa Exemplo',
      'Cargo Exemplo',
      'LinkedIn',
      'Novo',
      85
    ]
  ];

  // Criar o workbook
  const workbook = XLSX.utils.book_new();
  
  // Criar a planilha
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Adicionar a planilha ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
  
  return workbook;
};
