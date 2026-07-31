import { describe, expect, it, vi } from "vitest";
import { mockCoin } from "../../test/mocks/mockCoin";
import { fireEvent, render, screen } from "@testing-library/react";
import { ListCoins } from "./ListCoins";
import type { LineProps, ResponsiveContainerProps } from "recharts";

vi.mock("../../context/hooks/useAppContext", () => ({
  useAppContext: () => ({
    setSelectedCoinId: vi.fn(),
    setIsModalCoinVisible: vi.fn(),
  }),
}));

vi.mock("recharts", async () => {
  const original = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <div>{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <svg>{children}</svg>
    ),
    Line: ({ stroke }: LineProps) => (
      <path data-testid="sparklinePath" stroke={stroke} />
    ),
  };
});

const mockCoins = [
  mockCoin,
  {
    ...mockCoin,
    id: "ethereum",
    name: "Ethereum",
    symbol: "eth",
    market_cap_rank: 2,
  },
  {
    ...mockCoin,
    id: "solana",
    name: "Solana",
    symbol: "sol",
    market_cap_rank: 5,
  },
];

describe("ListCoin Component", () => {
  it("should render all coins initially", () => {
    render(<ListCoins coins={mockCoins} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Solana")).toBeInTheDocument();
  });

  it("should filter coins by name", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("search-coin");
    fireEvent.change(input, { target: { value: "Solana" } });

    expect(screen.getByText("Solana")).toBeInTheDocument();
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ethereum/i)).not.toBeInTheDocument();
  });

  it("should filter coins by symbol (case-insensitive)", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("search-coin");
    fireEvent.change(input, { target: { value: "ETH" } });

    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.queryByText(/solana/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
  });

  it("should show empty state message when no results found", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("search-coin");
    fireEvent.change(input, { target: { value: "NonExistentCoin" } });

    expect(screen.getByText("No coins found matching")).toBeInTheDocument();
    expect(screen.getByText(/NonExistentCoin/i)).toBeInTheDocument();
  });

  it("should clear search when the X button is clicked", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("search-coin");
    fireEvent.change(input, { target: { value: "Solana" } });

    const button = screen.getByTestId("button-search-coin");
    fireEvent.click(button);

    expect(input).toHaveValue("");
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });
});
