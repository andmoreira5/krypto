# Krypto — Cryptocurrency Analytics Dashboard

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/andmoreira5/krypto)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, high-performance cryptocurrency market analytics dashboard built with React, TypeScript, and Tailwind CSS. The application integrates real-time crypto data, interactive historical price charts, and comprehensive test coverage (Unit & E2E).

**Public Repository:** [Github](https://github.com/andmoreira5/krypto)

**Demo:** [Access the project](https://krypto-inky.vercel.app/)

---

## Features

- **Live Market Overview:** Real-time data fetching for top cryptocurrencies via CoinGecko API.
- **Interactive Price Charts:** Historical market data visualizer with dynamic timeframes (**1D**, **7D**, **1M**).
- **Responsive Coin Details Modal:** Detailed breakdown per coin with backdrop click & `ESC` key closing support.
- **Favorite Coins Filtering:** Quick-access filtering to track preferred assets.
- **Robust Error Handling:** Skeleton loading states and user-friendly error fallbacks.

---

## Tech Stack

- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Data Visualization:** Recharts
- **Unit & Component Testing:** Vitest, React Testing Library
- **End-to-End Testing (E2E):** Playwright
- **Code Quality:** ESLint, Prettier

---

## Testing Strategy

Quality assurance is divided into two distinct layers to ensure UI reliability and system integrity:

### 1. Unit & Integration Testing

Tests isolated components, custom hooks, custom contexts, and user event handlers.

```bash
npm run test
```

### 2. End-to-End Testing

Simulates real user workflows, verifying modal lifecycle, API request interceptions, dynamic timeframe switches, network failures, and keyboard accessibility.

```bash
npm run test:e2e
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 22.x`
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andmoreira5/krypto.git
   cd krypto
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed by <b>Anderson Moreira</b>
</p>

> 🇺🇸 This README is in English. For the Portuguese version, [click here](./README.ptbr.md).
