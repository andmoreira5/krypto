import type { Coin } from "../../src/types/crypto";

export const mockCoinsList: Partial<Coin>[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 50000,
    market_cap: 980000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 5.42,
    sparkline_in_7d: {
      price: [48000, 48500, 49000, 47500, 49200, 49800, 50000],
    },
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3200,
    market_cap: 380000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.85,
    sparkline_in_7d: {
      price: [3300, 3280, 3250, 3180, 3210, 3190, 3200],
    },
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "sol",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 145,
    market_cap: 67000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 12.3,
    sparkline_in_7d: {
      price: [128, 130, 135, 132, 140, 142, 145],
    },
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ada",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.45,
    market_cap: 16000000000,
    market_cap_rank: 4,
    price_change_percentage_24h: 0.15,
    sparkline_in_7d: {
      price: [0.44, 0.45, 0.43, 0.44, 0.46, 0.45, 0.45],
    },
  },
];
