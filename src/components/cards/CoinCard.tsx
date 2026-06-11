import { Award, TrendingDown, TrendingUp, StarIcon } from "lucide-react";
import type { Coin } from "../../types/crypto";
import { Sparkline } from "../list/Sparkline";
import { useAppContext } from "../../context/hooks/useAppContext";
import type { MouseEvent } from "react";

interface CoinCardProps {
  coin: Coin;
}

export const CoinCard = ({ coin }: CoinCardProps) => {
  const isPositive = coin.price_change_percentage_24h > 0;
  const {
    setSelectedCoinId,
    setIsModalCoinVisible,
    favorites,
    toggleFavorite,
  } = useAppContext();

  const isFavorite = favorites?.includes(coin.id);

  const handleCardClick = () => {
    setIsModalCoinVisible(true);
    setSelectedCoinId(coin.id);
  };

  const handleFavoriteClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleFavorite(coin.id);
  };

  return (
    <>
      <div
        className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border 
      border-white/5 hover:border-brand/40 transition-all duration-300 
        group shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute z-20 top-0 right-0 p-3 rounded-3xl"></div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full"
              />
              {coin.market_cap_rank <= 3 && (
                <div
                  data-testid="awardCoinCard"
                  className="absolute -top-2 -left-2 bg-brand text-darkBg rounded-full p-1 shadow-md"
                >
                  <Award size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <div>
              <h3
                data-testid="symbolCoinCard"
                className="font-bold text-white uppercase group-hover:text-brand transition-colors leading-tight"
              >
                {coin.symbol}
              </h3>
              <p
                data-testid="nameCoinCard"
                className="text-xs text-gray-500 font-medium"
              >
                {coin.name}
              </p>
            </div>
          </div>
          <div
            data-testid="valueCoinCard"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              isPositive
                ? "text-green-400 bg-green-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </div>
          <div
            onClick={handleFavoriteClick}
            data-testid="favoriteBtnCoinCard"
            className={`relative group/star cursor-pointer py-2 pl-2 -mt-1.5 transition-colors 
                duration-200 hover:text-brand ${
                  isFavorite ? "text-brand" : "text-gray-600"
                }`}
          >
            <StarIcon
              size={23}
              strokeWidth={3}
              fill="currentColor"
              className={`cursor-pointer transition-colors duration-200 ${
                isFavorite
                  ? "text-yellow-500 fill-yellow-400"
                  : "text-gray-600 fill-transparent"
              }`}
            />
            <span
              className="absolute bottom-full scale-0 rounded bg-slate-800 p-2 text-xs text-white 
                transition-all duration-100 group-hover/star:scale-100 whitespace-nowrap z-35 -right-5
                pointer-events-none shadow-xl border border-white/5"
            >
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="space-y-1">
            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
              Current price
            </span>
            <p
              data-testid="currentPriceCoinCard"
              className="text-2xl font-mono font-bold text-white"
            >
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(coin.current_price)}
            </p>
          </div>
          {coin.sparkline_in_7d?.price && (
            <div
              data-testid="sparklineCoinCard"
              className="flex-1 max-w-25 h-12 mb-1"
            >
              <Sparkline
                data={coin.sparkline_in_7d.price}
                isPositive={isPositive}
              />
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-gray-400">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-50">
              Mkt Cap
            </p>
            <p className="text-xs font-medium">
              ${(coin.market_cap / 1000000000).toFixed(2)}B
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold opacity-50">Rank</p>
            <p
              data-testid="marketCapRankCoinCard"
              className="text-xs font-bold text-brand"
            >
              #{coin.market_cap_rank}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
