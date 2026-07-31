import { Loader2 } from "lucide-react";
import { useCoins } from "../hooks/useCoins";
import { Header } from "../components/layout/Header";
import { ErrorState } from "../components/ui/error/ErrorState";
import { ListCoins } from "../components/list/ListCoins";

export const HomeCoinPage = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useCoins();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100">
      <Header isFetching={isFetching} onRefresh={refetch} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-brand" size={40} />
            <p className="text-gray-500 animate-pulse font-medium">
              Syncing Market Data...
            </p>
          </div>
        ) : isError ? (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Failed to fetch CoinGecko API data"
            }
            onRetry={refetch}
          />
        ) : (
          <ListCoins coins={data || []} />
        )}
      </main>
    </div>
  );
};
