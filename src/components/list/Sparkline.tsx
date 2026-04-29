import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
  const chartData = data.map((price, index) => ({
    value: price,
    id: index,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <YAxis hide domain={["auto", "auto"]} />

        <Line
          type="monotone"
          dataKey="value"
          stroke={isPositive ? "#22c55e" : "#ef4444"}
          strokeWidth={2}
          dot={false}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
