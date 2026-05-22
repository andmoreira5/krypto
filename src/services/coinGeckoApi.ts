import axios from "axios";

interface HistoricalDataResponse {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ChartDataPoint {
  x: number;
  y: number;
}

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

export const getCoinHistoricalData = async (
  coinId: string,
  days: number = 7,
): Promise<ChartDataPoint[]> => {
  const { data } = await coinGeckoApi.get<HistoricalDataResponse>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days: days,
        interval: "hourly",
      },
    },
  );

  return data.prices.map(
    ([timestamp, price]: [number, number]): ChartDataPoint => ({
      x: timestamp,
      y: price,
    }),
  );
};
