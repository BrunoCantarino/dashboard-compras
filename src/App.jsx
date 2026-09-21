import { useState } from 'react';
import FileUploader from './components/FileUploader';
import AlmoxarifadoTab from './components/AlmoxarifadoTab';
import SolicitacoesTab from './components/SolicitacoesTab';
import './styles/app.css';

export default function App() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('almoxarifado');
  const [error, setError] = useState('');

  function handleDataLoaded(loadedData) {
    setData(loadedData);
    setError('');
    setActiveTab('almoxarifado');
  }

  function handleError(errorMessage) {
    setError(errorMessage);
  }

  function handleClear() {
    setData(null);
    setError('');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>💼 Central de Compras</h1>
            <p>Análise de Almoxarifado e Solicitações de Compra</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="uploader-section">
            <FileUploader
              onDataLoaded={handleDataLoaded}
              onError={handleError}
              hasData={!!data}
            />
          </div>

          {error && (
            <div className="error-message">
              <span>❌ Erro: {error}</span>
            </div>
          )}

          {data && (
            <>
              <div className="tabs-container">
                <div className="tabs-header">
                  <button
                    className={`tab-button ${activeTab === 'almoxarifado' ? 'active' : ''}`}
                    onClick={() => setActiveTab('almoxarifado')}
                  >
                    📦 Almoxarifado
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'solicitacoes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('solicitacoes')}
                  >
                    🛒 Solicitações
                  </button>
                </div>

                <div className="tabs-content">
                  {activeTab === 'almoxarifado' && (
                    <AlmoxarifadoTab
                      rawData={data.almoxarifado}
                      onClear={handleClear}
                    />
                  )}
                  {activeTab === 'solicitacoes' && (
                    <SolicitacoesTab
                      rawData={data.solicitacoes}
                      onClear={handleClear}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {!data && (
            <div className="empty-state-main">
              <p>👆 Clique no botão acima para carregar o arquivo</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          SAP é a fonte oficial dos dados • Processamento local no navegador • v1.0
        </p>
      </footer>
    </div>
  );
}
