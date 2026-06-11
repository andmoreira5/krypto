import { useState } from "react";

export type FilterType = "ALL" | "FAVORITES";

export const useUIContext = () => {
  const [isModalCoinVisible, setIsModalCoinVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  return {
    isModalCoinVisible,
    setIsModalCoinVisible,
    activeFilter,
    setActiveFilter,
  };
};
