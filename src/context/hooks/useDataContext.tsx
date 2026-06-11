import { useState, useEffect } from "react";

const STORAGE_KEY = "@krypto:favorites";

export const useDataContext = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error localStorage:", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error localStorage:", error);
    }
  }, [favorites]);

  const toggleFavorite = (coinId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(coinId)
        ? prevFavorites.filter((id) => id !== coinId)
        : [...prevFavorites, coinId],
    );
  };

  return {
    selectedCoinId,
    setSelectedCoinId,
    favorites,
    toggleFavorite,
  };
};
