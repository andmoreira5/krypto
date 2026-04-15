import { useQuery } from "@tanstack/react-query";
import { getCoinGeckoMarkets } from "../services/coinGeckoApi";
import type { Coin } from "../types/crypto";

export const useCoins = () => {
  return useQuery<Coin[]>({
    queryKey: ["top-coins"],
    queryFn: getCoinGeckoMarkets,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
