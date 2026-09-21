import { useState, useMemo } from 'react';
import { processAlmoxarifado, prepareCopyData } from '../utils/almoxarifadoProcessor';

export default function AlmoxarifadoTab({ rawData, onClear }) {
  const [dados, setDados] = useState(() => processAlmoxarifado(rawData));
  const [copiedMessage, setCopiedMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar dados baseado na busca
  const dadosFiltrados = useMemo(() => {
    if (!searchTerm) return dados;

    const termo = searchTerm.toLowerCase();
    return dados.filter(item =>
      item.codigo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo)
    );
  }, [dados, searchTerm]);

  // Atualizar compra recomendada
  function handleCompraChange(index, novoValor) {
    const novoDados = [...dados];
    novoDados[index].compraRecomendada = novoValor === '' ? '' : parseFloat(novoValor) || 0;
    setDados(novoDados);
  }

  // Copiar para clipboard
  async function handleCopiar() {
    const texto = prepareCopyData(dados);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiedMessage('✓ Copiado para a área de transferência!');
      setTimeout(() => setCopiedMessage(''), 3000);
    } catch (error) {
      setCopiedMessage('✗ Erro ao copiar');
      setTimeout(() => setCopiedMessage(''), 3000);
    }
  }

  // Estatísticas
  const statsItensAlerta = dados.filter(d => d.precisaReposicao).length;

  return (
    <div className="tab-content almoxarifado-tab">
      <div className="tab-header">
        <h2>📦 Almoxarifado</h2>
        <p className="tab-description">
          Análise de movimentação e sugestão de reposição de itens
        </p>
      </div>

      {dados.length > 0 ? (
        <>
          <div className="tab-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por código ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="action-buttons">
              <button onClick={handleCopiar} className="btn btn-primary">
                📋 Copiar Resultados
              </button>
              <button onClick={onClear} className="btn btn-secondary">
                📁 Novo Arquivo
              </button>
            </div>
          </div>

          {copiedMessage && (
            <div className={`message ${copiedMessage.startsWith('✓') ? 'success' : 'error'}`}>
              {copiedMessage}
            </div>
          )}

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total de Itens:</span>
              <span className="stat-value">{dados.length}</span>
            </div>
            <div className="stat-item alert">
              <span className="stat-label">⚠️ Itens em Alerta:</span>
              <span className="stat-value">{statsItensAlerta}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Exibindo:</span>
              <span className="stat-value">{dadosFiltrados.length}</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th className="number">Estoque</th>
                  <th className="number">Média Mensal</th>
                  <th className="number">Diferença</th>
                  <th className="number">Compra Recomendada</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.map((item, index) => {
                  const realIndex = dados.indexOf(item);
                  return (
                    <tr key={item.codigo} className={item.precisaReposicao ? 'alert-row' : ''}>
                      <td className="code">{item.codigo}</td>
                      <td className="description">{item.descricao}</td>
                      <td className="number">{item.estoque}</td>
                      <td className="number">{item.media}</td>
                      <td className={`number ${item.diferenca < 0 ? 'negative' : 'positive'}`}>
                        {item.diferenca > 0 ? '+' : ''}{item.diferenca}
                      </td>
                      <td className="number">
                        <input
                          type="number"
                          value={item.compraRecomendada}
                          onChange={(e) => handleCompraChange(realIndex, e.target.value)}
                          className="quantity-input"
                          min="0"
                        />
                      </td>
                      <td className="status">
                        {item.precisaReposicao ? (
                          <span className="badge badge-warning">⚠️ Reposição</span>
                        ) : (
                          <span className="badge badge-ok">✓ OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="tab-footer">
            <p>
              <strong>Legenda:</strong> A "Compra Recomendada" é calculada como: <strong>Média Mensal × 1,5</strong> (cobertura para 1 mês e meio),
              arredondada para cima para garantir cobertura (ex: 3,45 → 4).
              O campo é editável para ajustar manualmente antes de copiar os resultados.
            </p>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Carregue um arquivo Excel para começar</p>
        </div>
      )}
    </div>
  );
}
