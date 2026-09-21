import * as XLSX from 'xlsx';

/**
 * Lê arquivo Excel e retorna os dados de uma aba específica
 * @param {File} file - Arquivo Excel
 * @param {string} sheetName - Nome da aba a ser lida
 * @returns {Promise<Array>} Array de objetos com os dados
 */
export async function parseExcelSheet(file, sheetName) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });

        if (!workbook.SheetNames.includes(sheetName)) {
          reject(new Error(`Aba "${sheetName}" não encontrada no arquivo`));
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        resolve(data);
      } catch (error) {
        reject(new Error(`Erro ao ler arquivo Excel: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Obtém lista de abas do arquivo Excel
 * @param {File} file - Arquivo Excel
 * @returns {Promise<Array<string>>} Lista de nomes de abas
 */
export async function getSheetNames(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        resolve(workbook.SheetNames);
      } catch (error) {
        reject(new Error(`Erro ao ler arquivo Excel: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsArrayBuffer(file);
  });
}
