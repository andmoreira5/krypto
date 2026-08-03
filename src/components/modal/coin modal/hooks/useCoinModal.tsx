import { useCallback, useEffect, useState } from "react";
import {
  getCoinHistoricalData,
  type ChartDataPoint,
} from "../../../../services/coinGeckoApi";
import { useAppContext } from "../../../../context/hooks/useAppContext";

export const useCoinModalData = () => {
  const {
    isModalCoinVisible,
    selectedCoinId,
    setIsModalCoinVisible,
    selectedDays,
  } = useAppContext();

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isModalCoinVisible || !selectedCoinId) return;

    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCoinHistoricalData(selectedCoinId, selectedDays);
        setChartData(data);
      } catch {
        setError("Failed to load historical charts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [isModalCoinVisible, selectedCoinId, selectedDays]);

  const handleClose = useCallback(() => {
    setIsModalCoinVisible(false);
    setChartData([]);
  }, [setIsModalCoinVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalCoinVisible) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalCoinVisible, handleClose]);

  return {
    isModalCoinVisible,
    selectedCoinId,
    chartData,
    isLoading,
    error,
    handleClose,
  };
};
