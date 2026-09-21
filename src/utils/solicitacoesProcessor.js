/**
 * Converte data em formato Excel serial para DD/MM/YYYY
 * SEM usar Date object para evitar problemas de timezone
 * @param {number} excelDate - Data em formato serial do Excel
 * @returns {string} Data formatada ou string vazia
 */
function formatExcelDate(excelDate) {
  if (!excelDate || excelDate === '' || excelDate === undefined) {
    return '';
  }

  try {
    const numDate = typeof excelDate === 'string' ? parseFloat(excelDate) : excelDate;
    if (isNaN(numDate)) return '';

    // Conversão direta de número serial do Excel para data
    // Sem usar Date object para evitar deslocamento de timezone
    // Excel começa em 01/01/1900 (serial = 1)

    // Ajusta para o bug do Excel (ano bissexto 1900)
    let dias = Math.floor(numDate);
    if (dias > 59) {
      dias -= 1; // Correção para o bug de 1900
    }

    // Calcula a data a partir de 01/01/1900
    let ano = 1900;
    let mes = 1;
    let dia = dias;

    // Tabela de dias por mês
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Avança por anos
    while (true) {
      const diasNoAno = (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 366 : 365;
      if (dia <= diasNoAno) break;
      dia -= diasNoAno;
      ano += 1;
    }

    // Avança por meses
    const ehBissexto = (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0));
    for (let i = 0; i < 12; i++) {
      let diasMes = diasPorMes[i];
      if (i === 1 && ehBissexto) diasMes = 29;

      if (dia <= diasMes) {
        mes = i + 1;
        break;
      }
      dia -= diasMes;
    }

    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(mes).padStart(2, '0');

    return `${diaStr}/${mesStr}/${ano}`;
  } catch (error) {
    return '';
  }
}

/**
 * Processa dados de solicitações de compra
 * @param {Array} rawData - Dados brutos do Excel
 * @returns {Object} { dados processados, total, ignorados }
 */
export function processSolicitacoes(rawData) {
  const camposPrincipais = [
    'Nº da solicitação de compra',
    'Data necessária',
    'Nome do solicitante',
    'Descrição do item',
    'Quantidade necessária',
    'Texto livre'
  ];

  let ignorados = 0;

  const dados = rawData
    .map((item, index) => {
      const numeroSolicitacao = item['Nº da solicitação de compra'];

      // Filtrar: ignorar linhas sem número de solicitação
      if (!numeroSolicitacao || numeroSolicitacao === '' || numeroSolicitacao === undefined) {
        ignorados++;
        return null;
      }

      return {
        id: index, // Para chave única no React
        numeroSolicitacao: numeroSolicitacao,
        dataNecessaria: formatExcelDate(item['Data necessária']),
        solicitante: item['Nome do solicitante'] || '',
        descricao: item['Descrição do item'] || '',
        quantidade: parseFloat(item['Quantidade necessária']) || 0,
        textoLivre: item['Texto livre'] || ''
      };
    })
    .filter(item => item !== null);

  return {
    dados,
    total: rawData.length,
    ignorados
  };
}

/**
 * Filtra solicitações baseado nos critérios
 * @param {Array} dados - Array de solicitações processadas
 * @param {Object} filtros - Objeto com critérios de filtro
 * @returns {Array} Dados filtrados
 */
export function filtrarSolicitacoes(dados, filtros) {
  return dados.filter(item => {
    // Filtro por data inicial
    if (filtros.dataInicial) {
      const dataItem = new Date(item.dataNecessaria.split('/').reverse().join('-'));
      const dataInicial = new Date(filtros.dataInicial);
      if (dataItem < dataInicial) return false;
    }

    // Filtro por data final
    if (filtros.dataFinal) {
      const dataItem = new Date(item.dataNecessaria.split('/').reverse().join('-'));
      const dataFinal = new Date(filtros.dataFinal);
      if (dataItem > dataFinal) return false;
    }

    // Filtro por solicitante
    if (filtros.solicitante) {
      if (item.solicitante.toLowerCase() !== filtros.solicitante.toLowerCase()) {
        return false;
      }
    }

    // Filtro por número de solicitação
    if (filtros.numeroSolicitacao) {
      if (item.numeroSolicitacao !== parseInt(filtros.numeroSolicitacao)) {
        return false;
      }
    }

    // Filtro por texto livre (busca em descrição e texto livre)
    if (filtros.textoBusca) {
      const textoBuscaLower = filtros.textoBusca.toLowerCase();
      const descricaoMatch = item.descricao.toLowerCase().includes(textoBuscaLower);
      const numeroMatch = item.numeroSolicitacao.toString().includes(filtros.textoBusca);
      const textoLivreMatch = item.textoLivre.toLowerCase().includes(textoBuscaLower);

      if (!descricaoMatch && !numeroMatch && !textoLivreMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Obtém lista única de solicitantes para dropdown
 * @param {Array} dados - Array de solicitações
 * @returns {Array} Lista de solicitantes únicos, ordenados
 */
export function getSolicitantesUnicos(dados) {
  const solicitantes = new Set(
    dados
      .map(item => item.solicitante)
      .filter(s => s && s.trim() !== '')
  );

  return Array.from(solicitantes).sort();
}
