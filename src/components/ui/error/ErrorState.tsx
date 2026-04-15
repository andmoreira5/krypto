import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="max-w-md mx-auto bg-red-500/5 border border-red-500/20 p-10 rounded-3xl text-center my-16 animate-in zoom-in-95 duration-300">
      <div className="inline-flex p-4 bg-red-500/10 rounded-full mb-6">
        <AlertTriangle className="text-red-500" size={40} />
      </div>

      <h2 className="text-2xl font-bold mb-3 text-white">
        Connection Interrupted
      </h2>

      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        {message ||
          "Houve um problema ao sincronizar os dados com a CoinGecko. Por favor, tente novamente em alguns instantes."}
      </p>

      <button
        onClick={onRetry}
        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
      >
        Try again
      </button>
    </div>
  );
};
