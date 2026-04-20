import type { Coin } from "../../types/crypto";

export const mockCoin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  current_price: 50000,
  price_change_percentage_24h: 5.42,
  market_cap_rank: 3,
} as Coin;
