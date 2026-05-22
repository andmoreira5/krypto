import { useState } from "react";

export const useUIContext = () => {
  const [isModalCoinVisible, setIsModalCoinVisible] = useState<boolean>(false);
  return { isModalCoinVisible, setIsModalCoinVisible };
};
