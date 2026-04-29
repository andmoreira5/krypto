import axios from "axios";

export const coinGeckoApi = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

export const getCoinGeckoMarkets = async () => {
  const { data } = await coinGeckoApi.get("/coins/markets", {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page: 1,
      sparkline: true,
    },
  });
  return data;
};
