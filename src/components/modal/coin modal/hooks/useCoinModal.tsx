import { useEffect, useState } from "react";
import {
  getCoinHistoricalData,
  type ChartDataPoint,
} from "../../../../services/coinGeckoApi";
import { useAppContext } from "../../../../context/hooks/useAppContext";

export const useCoinModalData = () => {
  const { isModalCoinVisible, selectedCoinId, setIsModalCoinVisible } =
    useAppContext();

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalCoinVisible || !selectedCoinId) return;

    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCoinHistoricalData(selectedCoinId, 7);
        setChartData(data);
      } catch (err) {
        console.error("Erro ao buscar dados históricos:", err);
        setError("Failed to load historical charts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [isModalCoinVisible, selectedCoinId]);

  const handleClose = () => {
    setIsModalCoinVisible(false);
    setChartData([]);
  };

  return {
    isModalCoinVisible,
    selectedCoinId,
    chartData,
    isLoading,
    error,
    handleClose,
  };
};
