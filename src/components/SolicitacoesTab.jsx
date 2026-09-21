import { useState, useMemo } from 'react';
import { processSolicitacoes, filtrarSolicitacoes, getSolicitantesUnicos } from '../utils/solicitacoesProcessor';

export default function SolicitacoesTab({ rawData, onClear }) {
  const { dados, total, ignorados } = useMemo(() => processSolicitacoes(rawData), [rawData]);

  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
    solicitante: '',
    numeroSolicitacao: '',
    textoBusca: ''
  });

  const solicitantesUnicos = useMemo(() => getSolicitantesUnicos(dados), [dados]);
  const dadosFiltrados = useMemo(() => filtrarSolicitacoes(dados, filtros), [dados, filtros]);

  function handleFiltroChange(campo, valor) {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  }

  function handleLimparFiltros() {
    setFiltros({
      dataInicial: '',
      dataFinal: '',
      solicitante: '',
      numeroSolicitacao: '',
      textoBusca: ''
    });
  }

  const temFiltros = Object.values(filtros).some(v => v !== '');

  return (
    <div className="tab-content solicitacoes-tab">
      <div className="tab-header">
        <h2>🛒 Solicitações de Compra</h2>
        <p className="tab-description">
          Visualize e filtre todas as solicitações de compra
        </p>
      </div>

      {dados.length > 0 ? (
        <>
          <div className="filters-section">
            <div className="filters-header">
              <h3>Filtros</h3>
              <div className="filters-header-actions">
                {temFiltros && (
                  <button onClick={handleLimparFiltros} className="btn btn-secondary btn-small">
                    Limpar Filtros
                  </button>
                )}
                <button onClick={onClear} className="btn btn-secondary btn-small">
                  📁 Novo Arquivo
                </button>
              </div>
            </div>

            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="filter-data-inicial">Data Inicial:</label>
                <input
                  id="filter-data-inicial"
                  type="date"
                  value={filtros.dataInicial}
                  onChange={(e) => handleFiltroChange('dataInicial', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="filter-data-final">Data Final:</label>
                <input
                  id="filter-data-final"
                  type="date"
                  value={filtros.dataFinal}
                  onChange={(e) => handleFiltroChange('dataFinal', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="filter-solicitante">Solicitante:</label>
                <select
                  id="filter-solicitante"
                  value={filtros.solicitante}
                  onChange={(e) => handleFiltroChange('solicitante', e.target.value)}
                  className="filter-input"
                >
                  <option value="">-- Todos --</option>
                  {solicitantesUnicos.map(solicitante => (
                    <option key={solicitante} value={solicitante}>
                      {solicitante}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-numero">Nº Solicitação:</label>
                <input
                  id="filter-numero"
                  type="number"
                  placeholder="Digite o número"
                  value={filtros.numeroSolicitacao}
                  onChange={(e) => handleFiltroChange('numeroSolicitacao', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group full-width">
                <label htmlFor="filter-texto">Busca Livre (Descrição, Nº Solicitação ou Obs):</label>
                <input
                  id="filter-texto"
                  type="text"
                  placeholder="Digite para buscar..."
                  value={filtros.textoBusca}
                  onChange={(e) => handleFiltroChange('textoBusca', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total de Registros:</span>
              <span className="stat-value">{total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Registros Ignorados (sem nº):</span>
              <span className="stat-value">{ignorados}</span>
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
                  <th>Nº Solicitação</th>
                  <th>Data</th>
                  <th>Solicitante</th>
                  <th>Descrição</th>
                  <th className="number">Quantidade</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.length > 0 ? (
                  dadosFiltrados.map(item => (
                    <tr key={item.id}>
                      <td className="code">{item.numeroSolicitacao}</td>
                      <td>{item.dataNecessaria}</td>
                      <td>{item.solicitante}</td>
                      <td className="description">{item.descricao}</td>
                      <td className="number">{item.quantidade}</td>
                      <td className="texto-livre">{item.textoLivre}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Nenhuma solicitação encontrada com os filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tab-footer">
            <p>
              💡 <strong>Dica:</strong> Use os filtros simultaneamente para refinar a busca.
              A busca livre pesquisa em descrição, número de solicitação e observações.
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
