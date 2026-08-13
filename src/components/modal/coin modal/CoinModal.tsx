import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useCoinModalData } from "./hooks/useCoinModal";
import { HeaderCoinModal } from "./HeaderCoinModal";
import { ErrorCoinModal } from "./ErrorCoinModal";
import { SkeletonCoinModal } from "./SkeletonCoinModal";
import { useAppContext } from "../../../context/hooks/useAppContext";

const TIMEFRAMES = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "1M", value: 30 },
];

export const CoinModal = () => {
  const { isModalCoinVisible, data, isPending, error, handleClose } =
    useCoinModalData();
  const { selectedDays, setSelectedDays } = useAppContext();

  if (!isModalCoinVisible) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatChartDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (selectedDays === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      data-testid="coin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={handleClose}
    >
      <div
        data-testid="coin-modal-content"
        className="relative w-full max-w-4xl bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderCoinModal handleClose={handleClose} />
        <div className="flex justify-center">
          {!error && (
            <div className="flex  items-center space-x-2 bg-slate-900/60 p-1 rounded-xl w-fit border border-white/5">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  data-testid={`timeframe-btn-${tf.label}`}
                  onClick={() => setSelectedDays(tf.value)}
                  disabled={isPending}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedDays === tf.value
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {isPending && <SkeletonCoinModal />}

          {error && !isPending && (
            <ErrorCoinModal error={error} handleClose={handleClose} />
          )}

          {!isPending && !error && data.length > 0 && (
            <div
              data-testid="modal-chart-container"
              style={{ minWidth: 0 }}
              className="space-y-4 animate-fade-in w-full h-52 mt-2 min-w-0"
            >
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <AreaChart
                  data={data}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="x"
                    tickFormatter={formatChartDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    dy={10}
                  />

                  <YAxis
                    dataKey="y"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-white/10 p-2.5 rounded-xl shadow-xl text-left">
                            <p className="text-[10px] text-slate-400 font-medium">
                              {new Date(data.x).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-sm font-bold text-blue-400 mt-0.5">
                              {formatCurrency(data.y)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
