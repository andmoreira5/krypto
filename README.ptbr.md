# Krypto — Dashboard de Análise de Criptomoedas

[![Version](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue.svg)](https://github.com/andmoreira5/krypto)
[![License: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Um dashboard moderno e de alta performance para análise do mercado de criptomoedas, construído com React, TypeScript e Tailwind CSS. A aplicação integra dados de criptomoedas em tempo real, gráficos de preços históricos interativos e uma cobertura completa de testes (Unitários e E2E).

**Repositório Público:** [GitHub](https://github.com/andmoreira5/krypto)

**Demonstração:** [Acessar o projeto](https://krypto-inky.vercel.app/)

---

## Funcionalidades

- **Visão Geral do Mercado em Tempo Real:** Busca de dados em tempo real das principais criptomoedas através da API do CoinGecko.
- **Gráficos de Preços Interativos:** Visualizador de dados históricos do mercado com períodos dinâmicos (**1D**, **7D**, **1M**).
- **Modal Responsivo de Detalhes da Moeda:** Detalhamento completo por moeda, com suporte a fechamento ao clicar fora (_backdrop_) ou pressionar a tecla `ESC`.
- **Filtro de Moedas Favoritas:** Filtro de acesso rápido para acompanhar seus ativos preferidos.
- **Tratamento Robusto de Erros:** Estados de carregamento (_skeleton loading_) e mensagens amigáveis em caso de falha.

---

## Tecnologias Utilizadas

- **Core:** React 19, TypeScript, Vite
- **Estilização:** Tailwind CSS, Lucide React (Ícones)
- **Visualização de Dados:** Recharts
- **Testes Unitários e de Componentes:** Vitest, React Testing Library
- **Testes End-to-End (E2E):** Playwright
- **Qualidade de Código:** ESLint, Prettier

---

## Estratégia de Testes

A garantia de qualidade é dividida em duas camadas distintas para assegurar a confiabilidade da interface e a integridade do sistema:

### 1. Testes Unitários e de Integração

Testa componentes isolados, hooks customizados, contextos e manipuladores de eventos de usuário.

```bash
npm run test
```

### 2. Testes End-to-End

Simula fluxos reais de usuários, verificando o ciclo de vida do modal, interceptação de requisições de API, troca de períodos dinâmicos nos gráficos, falhas de rede e acessibilidade via teclado.

```bash
npm run test:e2e
```

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** `>= 22.x`
- **npm**, **yarn** ou **pnpm**

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/andmoreira5/krypto.git
   cd krypto
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Gere a build de produção:**

   ```bash
   npm run build
   ```

---

## Licença

Distribuído sob a Licença MIT. Veja o arquivo `LICENSE` para mais informações.

---

<p align="center">
  Desenvolvido por <b>Anderson Moreira</b>
</p>

> 🇧🇷 Este README está em português. Para a versão em inglês, [clique aqui](./README.md).
