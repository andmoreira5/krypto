import { useState } from "react";

export const useDataContext = () => {
  const [selectedCoinId, setSelectedCoinId] = useState(null);

  return {
    selectedCoinId,
    setSelectedCoinId,
  };
};
