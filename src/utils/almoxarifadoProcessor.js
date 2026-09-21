/**
 * Processa dados do almoxarifado e calcula média mensal e diferença
 * @param {Array} rawData - Dados brutos do Excel
 * @returns {Array} Dados processados com cálculos
 */
export function processAlmoxarifado(rawData) {
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT'];

  return rawData
    .map(item => {
      // Extrair código e descrição
      const codigo = item['Nº do item'];
      const descricao = item['Descrição do item/serviço'];
      const estoque = parseFloat(item['Em Estoque']) || 0;

      // Validação básica
      if (!codigo || !descricao) {
        return null;
      }

      // Extrair valores dos meses (JAN-OUT)
      const valores = meses.map(mes => {
        const valor = item[mes];
        if (valor === undefined || valor === null || valor === '') {
          return 0;
        }
        return parseFloat(valor) || 0;
      });

      // Calcular média (soma de todos os 10 meses / 10)
      const soma = valores.reduce((acc, val) => acc + val, 0);
      const media = soma / meses.length;

      // Calcular diferença (estoque - média)
      const diferenca = estoque - media;

      // Determinar se precisa reposição (média > estoque)
      const precisaReposicao = media > estoque;

      // Calcular compra recomendada: média × 1,5 (cobertura para 1,5 meses)
      // Sempre arredondar para CIMA (ceiling) para garantir cobertura
      const compraRecomendada = Math.ceil(media * 1.5);

      return {
        codigo,
        descricao,
        estoque,
        media: Math.round(media * 100) / 100, // Arredondar para 2 casas decimais
        diferenca: Math.round(diferenca * 100) / 100,
        precisaReposicao,
        compraRecomendada, // Campo editável com cálculo de 1,5 meses
        valores: valores // Para debugging
      };
    })
    .filter(item => item !== null)
    .sort((a, b) => {
      // Ordenar: primeiro itens que precisam reposição, depois por código
      if (a.precisaReposicao !== b.precisaReposicao) {
        return b.precisaReposicao ? 1 : -1;
      }
      return a.codigo.localeCompare(b.codigo);
    });
}

/**
 * Prepara dados para copiar para Excel
 * @param {Array} dados - Array de itens processados
 * @returns {string} Texto formatado para copiar/colar no Excel
 */
export function prepareCopyData(dados) {
  // Cabeçalho
  const cabecalho = ['Código', 'Descrição', 'Estoque Atual', 'Média Mensal', 'Diferença', 'Compra Recomendada'].join('\t');

  // Linhas de dados
  const linhas = dados.map(item => [
    item.codigo,
    item.descricao,
    item.estoque,
    item.media,
    item.diferenca,
    item.compraRecomendada
  ].join('\t'));

  return [cabecalho, ...linhas].join('\n');
}
