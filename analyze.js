const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Blessed\\projetos\\uso-pessoal\\dashboard-compras\\docs\\exemplos\\RELATORIOS.xlsx';

console.log('=== ANÁLISE DO ARQUIVO RELATORIOS.xlsx ===\n');

try {
  // Ler o workbook
  const workbook = XLSX.readFile(filePath);
  
  console.log('ABAS ENCONTRADAS:');
  console.log('===============');
  workbook.SheetNames.forEach((name, index) => {
    console.log(\  \. \\);
  });
  console.log('');
  
  // Analisar cada aba
  for (const sheetName of workbook.SheetNames) {
    console.log(\\n\nABA: "\"\);
    console.log('='.repeat(50));
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      defval: '',
      blankrows: false 
    });
    
    // Informações gerais
    console.log(\Linhas de dados: \\);
    
    if (data.length > 0) {
      const colunas = Object.keys(data[0]);
      console.log(\Colunas: \\);
      console.log('Cabeçalhos:', colunas);
      console.log('');
      
      // Mostrar primeiras 5 linhas
      console.log('PRIMEIRAS 5 LINHAS (amostra):');
      console.log('---');
      for (let i = 0; i < Math.min(5, data.length); i++) {
        console.log(\Linha \:\);
        Object.entries(data[i]).forEach(([key, value]) => {
          console.log(\  \: \\);
        });
        console.log('');
      }
      
      // Análise de tipos de dados
      console.log('ANÁLISE DE DADOS:');
      console.log('---');
      const sample = data[0];
      Object.entries(sample).forEach(([key, value]) => {
        console.log(\  \: "\" (tipo: \)\);
      });
    }
  }
  
} catch (error) {
  console.error('Erro ao ler arquivo:', error.message);
}
