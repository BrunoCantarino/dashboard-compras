import { useRef } from 'react';
import { parseExcelSheet } from '../utils/xlsxParser';

export default function FileUploader({ onDataLoaded, onError, hasData }) {
  const inputRef = useRef(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Carregar ambas as abas simultaneamente
      const [almoxarifadoData, solicitacoesData] = await Promise.all([
        parseExcelSheet(file, 'PLANILHA DE ALMOXARIFADO'),
        parseExcelSheet(file, 'SOLICITAÇÕES DE COMPRAS')
      ]);

      onDataLoaded({
        almoxarifado: almoxarifadoData,
        solicitacoes: solicitacoesData
      });

      // Reset do input para permitir carregar o mesmo arquivo novamente
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (error) {
      onError(error.message);
      // Reset do input em caso de erro
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function handleButtonClick() {
    inputRef.current?.click();
  }

  return (
    <div className="file-uploader file-uploader-main">
      <div className="file-uploader-header">
        <div className="file-uploader-info">
          <h3>📦 Carregar Solicitação de Compras e Análise de Almoxarifado</h3>
          <p className="file-uploader-status">
            {hasData ? '✓ Dados carregados' : 'Nenhum arquivo carregado'}
          </p>
        </div>
        <button
          onClick={handleButtonClick}
          className="file-input-label"
          type="button"
        >
          📁 Carregar arquivo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="file-input"
      />
      <p className="file-help-text">
        Selecione o arquivo Excel RELATORIOS.xlsx exportado do SAP
      </p>
    </div>
  );
}
