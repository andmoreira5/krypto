import {
  useActionState,
  useEffect,
  useTransition,
} from "react";
import {
  getCoinHistoricalData,
  type ChartDataPoint,
} from "../../../../services/coinGeckoApi";
import { useAppContext } from "../../../../context/hooks/useAppContext";

export const useCoinModalData = () => {
  interface ActionState {
    data: ChartDataPoint[];
    error: string | null;
  }

  const {
    isModalCoinVisible,
    selectedCoinId,
    setIsModalCoinVisible,
    selectedDays,
  } = useAppContext();

  async function fetchCoinDataAction(
    _prevState: ActionState,
    params: { coinId: string; days: number },
  ): Promise<ActionState> {
    try {
      const data = await getCoinHistoricalData(params.coinId, params.days);
      return { data, error: null };
    } catch {
      return {
        data: [],
        error: "Failed to load historical charts. Please try again.",
      };
    }
  }

  const [state, dispatchFetch, isPending] = useActionState(
    fetchCoinDataAction,
    { data: [], error: null },
  );

  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isModalCoinVisible || !selectedCoinId) return;

    startTransition(() => {
      dispatchFetch({ coinId: selectedCoinId, days: selectedDays });
    });
  }, [isModalCoinVisible, selectedCoinId, selectedDays, dispatchFetch]);

  const handleClose = () => {
    setIsModalCoinVisible(false);
  };

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
    data: state.data,
    isPending,
    error: state.error,
    handleClose,
  };
};
