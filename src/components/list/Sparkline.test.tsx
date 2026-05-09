import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sparkline } from "./Sparkline";

vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Line: ({ stroke }: { stroke: string }) => (
      <div data-testid="chart-line" data-color={stroke} />
    ),
    YAxis: () => null,
  };
});

describe("Sparkline component", () => {
  const mockData = [100, 105, 95, 110];

  it("applies the correct green color when isPositive is true", () => {
    const { getByTestId } = render(
      <Sparkline data={mockData} isPositive={true} />,
    );

    const line = getByTestId("chart-line");
    expect(line).toHaveAttribute("data-color", "#22c55e");
  });

  it("applies the correct red color when isPositive is false", () => {
    const { getByTestId } = render(
      <Sparkline data={mockData} isPositive={false} />,
    );

    const line = getByTestId("chart-line");
    expect(line).toHaveAttribute("data-color", "#ef4444");
  });
});
