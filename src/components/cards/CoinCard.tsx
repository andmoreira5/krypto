import { Award, TrendingDown, TrendingUp } from "lucide-react";
import type { Coin } from "../../types/crypto";

interface CoinCardProps {
  coin: Coin;
}

export const CoinCard = ({ coin }: CoinCardProps) => {
  const isPositive = coin.price_change_percentage_24h > 0;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:border-brand/40 transition-all duration-300 group shadow-lg">
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
      </div>

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

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-gray-400">
        <div>
          <p className="text-[10px] uppercase font-bold opacity-50">Mkt Cap</p>
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
  );
};
