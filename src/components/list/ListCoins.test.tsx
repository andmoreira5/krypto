import { describe, expect, it } from "vitest";
import { mockCoin } from "../../test/mocks/mockCoin";
import { fireEvent, render, screen } from "@testing-library/react";
import { ListCoins } from "./ListCoins";

const mockCoins = [
  mockCoin,
  { ...mockCoin, id: "ethereum", name: "Ethereum", symbol: "eth" },
  { ...mockCoin, id: "solana", name: "Solana", symbol: "sol" },
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

    const input = screen.getByTestId("searchCoin");
    fireEvent.change(input, { target: { value: "Solana" } });

    expect(screen.getByText("Solana")).toBeInTheDocument();
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ethereum/i)).not.toBeInTheDocument();
  });

  it("should filter coins by symbol (case-insensitive)", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("searchCoin");
    fireEvent.change(input, { target: { value: "ETH" } });

    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.queryByText(/solana/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/bitcoin/i)).not.toBeInTheDocument();
  });

  it("should show empty state message when no results found", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("searchCoin");
    fireEvent.change(input, { target: { value: "NonExistentCoin" } });

    expect(screen.getByText("No coins found matching")).toBeInTheDocument();
    expect(screen.getByText(/NonExistentCoin/i)).toBeInTheDocument();
  });

  it("should clear search when the X button is clicked", () => {
    render(<ListCoins coins={mockCoins} />);

    const input = screen.getByTestId("searchCoin");
    fireEvent.change(input, { target: { value: "Solana" } });

    const button = screen.getByTestId("buttonSearchCoin");
    fireEvent.click(button);

    expect(input).toHaveValue("");
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });
});
