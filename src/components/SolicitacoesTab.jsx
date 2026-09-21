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

  const [ordenacao, setOrdenacao] = useState('padrao');

  const solicitantesUnicos = useMemo(() => getSolicitantesUnicos(dados), [dados]);
  const dadosFiltrados = useMemo(() => filtrarSolicitacoes(dados, filtros), [dados, filtros]);

  function ordenarDados(dados) {
    const copia = [...dados];

    switch (ordenacao) {
      case 'padrao':
        return copia; // Sem ordenação

      case 'data-recente':
        return copia.sort((a, b) => {
          const [diaA, mesA, anoA] = a.dataNecessaria.split('/').map(Number);
          const [diaB, mesB, anoB] = b.dataNecessaria.split('/').map(Number);
          const dateA = new Date(anoA, mesA - 1, diaA);
          const dateB = new Date(anoB, mesB - 1, diaB);
          return dateB - dateA;
        });

      case 'data-antiga':
        return copia.sort((a, b) => {
          const [diaA, mesA, anoA] = a.dataNecessaria.split('/').map(Number);
          const [diaB, mesB, anoB] = b.dataNecessaria.split('/').map(Number);
          const dateA = new Date(anoA, mesA - 1, diaA);
          const dateB = new Date(anoB, mesB - 1, diaB);
          return dateA - dateB;
        });

      case 'qtd-maior':
        return copia.sort((a, b) => b.quantidade - a.quantidade);

      case 'qtd-menor':
        return copia.sort((a, b) => a.quantidade - b.quantidade);

      case 'desc-az':
        return copia.sort((a, b) =>
          a.descricao.localeCompare(b.descricao, 'pt-BR', { sensitivity: 'base' })
        );

      case 'desc-za':
        return copia.sort((a, b) =>
          b.descricao.localeCompare(a.descricao, 'pt-BR', { sensitivity: 'base' })
        );

      case 'solicitante-az':
        return copia.sort((a, b) =>
          a.solicitante.localeCompare(b.solicitante, 'pt-BR', { sensitivity: 'base' })
        );

      case 'solicitante-za':
        return copia.sort((a, b) =>
          b.solicitante.localeCompare(a.solicitante, 'pt-BR', { sensitivity: 'base' })
        );

      case 'num-maior':
        return copia.sort((a, b) => b.numeroSolicitacao - a.numeroSolicitacao);

      case 'num-menor':
        return copia.sort((a, b) => a.numeroSolicitacao - b.numeroSolicitacao);

      default:
        return copia;
    }
  }

  const dadosOrdenados = useMemo(() => ordenarDados(dadosFiltrados), [dadosFiltrados, ordenacao]);

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
              <span className="stat-value">{dadosOrdenados.length}</span>
            </div>
          </div>

          <div className="sort-section">
            <label htmlFor="sort-select">Ordenar por:</label>
            <select
              id="sort-select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="sort-select"
            >
              <option value="padrao">Padrão</option>
              <option value="data-recente">Data — mais recente → mais antiga</option>
              <option value="data-antiga">Data — mais antiga → mais recente</option>
              <option value="qtd-maior">Quantidade — maior → menor</option>
              <option value="qtd-menor">Quantidade — menor → maior</option>
              <option value="desc-az">Descrição — A → Z</option>
              <option value="desc-za">Descrição — Z → A</option>
              <option value="solicitante-az">Solicitante — A → Z</option>
              <option value="solicitante-za">Solicitante — Z → A</option>
              <option value="num-maior">Nº da solicitação — maior → menor</option>
              <option value="num-menor">Nº da solicitação — menor → maior</option>
            </select>
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
                {dadosOrdenados.length > 0 ? (
                  dadosOrdenados.map(item => (
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
