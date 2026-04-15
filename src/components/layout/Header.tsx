import { RefreshCw } from "lucide-react";

interface HeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
}

export const Header = ({ isFetching, onRefresh }: HeaderProps) => {
  return (
    <header className="border-b border-white/5 py-6 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)] group-hover:scale-105 transition-transform">
            <span className="text-[#050505] font-black text-xl">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              KRYPTO
            </h1>
            <p className="text-[10px] text-brand font-bold tracking-[0.2em] uppercase mt-1">
              Market Monitor
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isFetching}
          title="Atualizar mercado"
          className="p-2.5 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10 disabled:opacity-50"
        >
          <RefreshCw
            size={20}
            className={`${isFetching ? "animate-spin" : ""} text-brand`}
          />
        </button>
      </div>
    </header>
  );
};
