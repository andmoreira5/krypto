import { useState } from "react";
import type { Coin } from "../../types/crypto";
import { Search, X } from "lucide-react";
import { CoinCard } from "../cards/CoinCard";

interface ListCoinProps {
  coins: Coin[];
}

export const ListCoins = ({ coins }: ListCoinProps) => {
  const [search, setSearch] = useState("");

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-center w-full mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search coin by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="searchCoin"
            className="block w-full bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-10 pr-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              data-testid="buttonSearchCoin"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {filteredCoins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500 text-lg">
            No coins found matching{" "}
            <span className="text-gray-200 font-semibold italic">
              "{search}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
