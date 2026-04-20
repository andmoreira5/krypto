import { describe, expect, it } from "vitest";
import { CoinCard } from "./CoinCard";
import { render, screen } from "@testing-library/react";
import { mockCoin } from "../../test/mocks/mockCoin";

describe("CoinCard Component", () => {
  it("should render coin name and symbol correctly", () => {
    render(<CoinCard coin={mockCoin} />);
    expect(screen.getByTestId("nameCoinCard")).toHaveTextContent("Bitcoin");
    expect(screen.getByTestId("symbolCoinCard")).toHaveTextContent(/btc/i);
  });

  describe("Price Variation Styling", () => {
    it("should apply green color classes when price change is positive", () => {
      render(<CoinCard coin={mockCoin} />);
      const badge = screen.getByTestId("valueCoinCard");
      expect(badge).toHaveTextContent(/5.42%/);
      expect(badge).toHaveClass("text-green-400");
    });

    it("should apply red color classes when price change is negative", () => {
      const negativeMockCoin = {
        ...mockCoin,
        price_change_percentage_24h: -3.59,
      };
      render(<CoinCard coin={negativeMockCoin} />);
      const badge = screen.getByTestId("valueCoinCard");
      expect(badge).toHaveTextContent(/3.59/);
      expect(badge).toHaveClass("text-red-400");
    });
  });

  describe("Market Cap Ranking and Awards", () => {
    it("should display the award icon for top 3 ranked coins", () => {
      render(<CoinCard coin={mockCoin} />);
      expect(screen.getByTestId("awardCoinCard")).toBeInTheDocument();
      expect(screen.getByTestId("marketCapRankCoinCard")).toHaveTextContent(
        "#3",
      );
    });

    it("should not display the award icon for coins ranked below 3", () => {
      const lowRankCoin = { ...mockCoin, market_cap_rank: 4 };
      render(<CoinCard coin={lowRankCoin} />);
      expect(screen.queryByTestId("awardCoinCard")).not.toBeInTheDocument();
      expect(screen.getByTestId("marketCapRankCoinCard")).toHaveTextContent(
        "#4",
      );
    });
  });

  it("should format and display the current price in USD correctly", () => {
    render(<CoinCard coin={mockCoin} />);
    const price = screen.getByTestId("currentPriceCoinCard");
    expect(price).toBeInTheDocument();
    expect(price).toHaveTextContent(/\$50,000\.00/);
  });
});
