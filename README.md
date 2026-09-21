# 💼 Central de Compras

Aplicação web para análise de almoxarifado e gerenciamento de solicitações de compra exportadas do SAP.

## 🚀 Início Rápido

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

A aplicação abrirá em `http://localhost:5173`

## 📋 Funcionalidades

### 📦 Módulo Almoxarifado

- **Carregamento de dados**: Upload do arquivo Excel exportado do SAP
- **Cálculo de média mensal**: Média de saídas de janeiro a outubro (10 meses)
- **Comparação com estoque**: Identifica itens que precisam de reposição
- **Edição de quantidade**: Permite ajustar manualmente a quantidade sugerida
- **Exportação para Excel**: Copia os resultados formatados para colar no Excel

#### Como usar:
1. Clique em "Selecionar arquivo Excel"
2. Escolha o arquivo `RELATORIOS.xlsx`
3. Clique na aba "Almoxarifado"
4. Os itens com ⚠️ "Reposição" têm média de saída maior que o estoque atual
5. Ajuste as quantidades sugeridas se necessário
6. Clique em "Copiar Resultados" para copiar os dados
7. Cole no Excel (Ctrl+V)

### 🛒 Módulo Solicitações de Compra

- **Carregamento de dados**: Lê automaticamente a aba "SOLICITAÇÕES DE COMPRAS"
- **Filtros simultâneos**: 
  - Data inicial e final
  - Solicitante
  - Número da solicitação
  - Busca de texto livre
- **Visualização clara**: Tabela com todas as informações relevantes
- **Múltiplos itens por solicitação**: Uma solicitação pode ter vários itens

#### Como usar:
1. Clique na aba "Solicitações" após carregar o arquivo
2. Use os filtros para refinar a busca:
   - Data inicial/final: selecione um intervalo de datas
   - Solicitante: escolha na lista dropdown
   - Nº Solicitação: digite o número específico
   - Busca Livre: busca em descrição, número de solicitação e observações
3. Os filtros funcionam simultaneamente
4. Clique em "Limpar Filtros" para resetar

#### Notas importantes:
- Registros sem número de solicitação são ignorados (mostrado no contador)
- Cada linha é um item de uma solicitação
- Uma solicitação pode aparecer em múltiplas linhas (itens diferentes)

## 📊 Processamento de Dados

### Almoxarifado

**Período**: Janeiro a Outubro (10 meses fixos)

**Cálculo da Média:**
```
Média = (JAN + FEV + MAR + ABR + MAI + JUN + JUL + AGO + SET + OUT) ÷ 10
```

**Indicador de Reposição:**
- ⚠️ Se `Média > Estoque Atual` → Item precisa de reposição
- ✓ Se `Média ≤ Estoque Atual` → Estoque adequado

**Diferença:**
- Valor = Estoque Atual - Média
- Positivo (verde) = Sobra de estoque
- Negativo (vermelho) = Falta de cobertura

### Solicitações

**Filtros aplicados:**
- Apenas registros COM número de solicitação são exibidos
- Registros sem número (13 do arquivo de exemplo) são ignorados
- Datas são convertidas do formato Excel serial para DD/MM/YYYY

**Buscas:**
- Pesquisa de texto inclui: descrição, número de solicitação e observações
- Case-insensitive e sem requisitos de correspondência exata

## 🏗️ Arquitetura

```
src/
├── App.jsx                      # Componente principal com abas
├── main.jsx                     # Ponto de entrada
├── styles/
│   └── app.css                  # Estilos globais
├── utils/
│   ├── xlsxParser.js            # Leitura de arquivos Excel
│   ├── almoxarifadoProcessor.js # Lógica de cálculo
│   └── solicitacoesProcessor.js # Lógica de filtros
└── components/
    ├── FileUploader.jsx         # Componente de upload
    ├── AlmoxarifadoTab.jsx      # Aba Almoxarifado
    └── SolicitacoesTab.jsx      # Aba Solicitações
```

## 🔧 Tecnologias

- **React 18** - Framework UI
- **Vite 5** - Build tool
- **XLSX 0.18** - Leitura de arquivos Excel
- **CSS3** - Estilos (puro, sem dependências)

## 💡 Notas Importantes

1. **Segurança**: Todos os dados são processados localmente no navegador
2. **SAP**: A aplicação NÃO substitui o SAP
3. **Dados originais**: Os arquivos não são alterados
4. **Sem backend**: Não há servidor ou banco de dados

## 🐛 Limitações v1

- Período fixo em JAN-OUT para Almoxarifado
- NOV e DEZ ignorados (sem dados no arquivo analisado)
- Sem persistência de dados (recarregar página limpa os dados)
- Sem suporte a múltiplos arquivos simultâneos

## 📝 Licença

Projeto interno - Setor de Compras
