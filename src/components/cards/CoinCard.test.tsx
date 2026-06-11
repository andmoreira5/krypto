import { beforeEach, describe, expect, it, vi } from "vitest";
import { CoinCard } from "./CoinCard";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockCoin } from "../../test/mocks/mockCoin";
import type { LineProps, ResponsiveContainerProps } from "recharts";

const mockSetSelectedCoinId = vi.fn();
const mockSetIsModalCoinVisible = vi.fn();
const mockToggleFavorite = vi.fn();
let mockFavorites: string[] = [];

vi.mock("../../context/hooks/useAppContext", () => ({
  useAppContext: () => ({
    setSelectedCoinId: mockSetSelectedCoinId,
    setIsModalCoinVisible: mockSetIsModalCoinVisible,
    favorites: mockFavorites,
    toggleFavorite: mockToggleFavorite,
  }),
}));

vi.mock("recharts", async () => {
  const original = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: ResponsiveContainerProps) => (
      <div style={{ width: "100px", height: "50px" }}>{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <svg>{children}</svg>
    ),
    Line: ({ stroke }: LineProps) => (
      <path data-testid="sparklinePath" stroke={stroke} />
    ),
  };
});

const negativeMockCoin = {
  ...mockCoin,
  price_change_percentage_24h: -3.59,
};

describe("CoinCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFavorites = [];
  });

  describe("Display informations", () => {
    it("should render coin name and symbol correctly", () => {
      render(<CoinCard coin={mockCoin} />);
      expect(screen.getByTestId("nameCoinCard")).toHaveTextContent("Bitcoin");
      expect(screen.getByTestId("symbolCoinCard")).toHaveTextContent(/btc/i);
    });

    it("should format and display the current price in USD correctly", () => {
      render(<CoinCard coin={mockCoin} />);
      const price = screen.getByTestId("currentPriceCoinCard");
      expect(price).toBeInTheDocument();
      expect(price).toHaveTextContent(/\$50,000\.00/);
    });
  });

  describe("Price Variation Styling", () => {
    it("should apply green color classes when price change is positive", () => {
      render(<CoinCard coin={mockCoin} />);
      const badge = screen.getByTestId("valueCoinCard");
      expect(badge).toHaveTextContent(/5.42%/);
      expect(badge).toHaveClass("text-green-400");
    });

    it("should apply red color classes when price change is negative", () => {
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

  describe("Sparkline", () => {
    it("should display the sparkline if it exists", () => {
      render(<CoinCard coin={mockCoin} />);
      const sparkline = screen.getByTestId("sparklineCoinCard");
      expect(sparkline).toBeInTheDocument();
    });

    it("should render the sparkline with green color when price change is positive", () => {
      render(<CoinCard coin={mockCoin} />);
      const path = screen.getByTestId("sparklinePath");
      expect(path).toHaveAttribute("stroke", "#22c55e");
    });

    it("should render the sparkline whit red color when price change is negative", () => {
      render(<CoinCard coin={negativeMockCoin} />);
      const path = screen.getByTestId("sparklinePath");
      expect(path).toHaveAttribute("stroke", "#ef4444");
    });

    it("should not render sparkline when data is missing", () => {
      const coinWithoutData = { ...mockCoin, sparkline_in_7d: undefined };
      render(<CoinCard coin={coinWithoutData} />);
      const sparkline = screen.queryByTestId("sparklinePath");
      expect(sparkline).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should trigger context actions when card is clicked", async () => {
      render(<CoinCard coin={mockCoin} />);

      const card = screen
        .getByTestId("nameCoinCard")
        .closest(".cursor-pointer");
      expect(card).toBeInTheDocument();

      await userEvent.click(card!);

      expect(mockSetIsModalCoinVisible).toHaveBeenCalledWith(true);
      expect(mockSetIsModalCoinVisible).toHaveBeenCalledTimes(1);

      expect(mockSetSelectedCoinId).toHaveBeenCalledWith(mockCoin.id);
      expect(mockSetSelectedCoinId).toHaveBeenCalledTimes(1);
    });
  });

  describe("Favorite Coin", () => {
    it("should render gray color if the coin is not favorited", () => {
      render(<CoinCard coin={mockCoin} />);
      const button = screen.getByTestId("favoriteBtnCoinCard");
      const star = button.querySelector("svg");

      expect(button).toHaveClass("text-gray-600");
      expect(star).toHaveClass("fill-transparent");
    });

    it("should render yellow color if the coin is favorited", () => {
      mockFavorites = [mockCoin.id];
      render(<CoinCard coin={mockCoin} />);
      const button = screen.getByTestId("favoriteBtnCoinCard");
      const star = button.querySelector("svg");

      expect(button).toHaveClass("text-brand");
      expect(star).toHaveClass("fill-yellow-400");
    });

    it("should render the tooltip correctly if the coin isn't favorited", () => {
      render(<CoinCard coin={mockCoin} />);
      const button = screen.getByTestId("favoriteBtnCoinCard");
      fireEvent.mouseOver(button);
      expect(screen.getByText("Adicionar aos favoritos")).toBeInTheDocument();
    });

    it("should render the tooltip correctly if the coin is favorited", () => {
      mockFavorites = [mockCoin.id];
      render(<CoinCard coin={mockCoin} />);
      const button = screen.getByTestId("favoriteBtnCoinCard");
      fireEvent.mouseOver(button);
      expect(screen.getByText("Remover dos favoritos")).toBeInTheDocument();
    });
  });
});
