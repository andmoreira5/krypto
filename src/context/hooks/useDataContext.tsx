import { useState } from "react";

export const useDataContext = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  return {
    selectedCoinId,
    setSelectedCoinId,
  };
};
