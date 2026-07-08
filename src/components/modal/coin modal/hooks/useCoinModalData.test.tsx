import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCoinModalData } from "./useCoinModal";
import { useAppContext } from "../../../../context/hooks/useAppContext";
import { getCoinHistoricalData } from "../../../../services/coinGeckoApi";
import type { AppContextType } from "../../../../context/AppContext";

vi.mock("../../../../context/hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("../../../../services/coinGeckoApi", () => ({
  getCoinHistoricalData: vi.fn(),
}));

describe("useCoinModalData Custom Hook", () => {
  const mockSetIsModalCoinVisible = vi.fn();
  const mockSetSelectedDays = vi.fn();

  const baseContextMock: AppContextType = {
    selectedDays: 7,
    setSelectedDays: mockSetSelectedDays,
    selectedCoinId: "bitcoin",
    setSelectedCoinId: vi.fn(),
    favorites: [],
    toggleFavorite: vi.fn(),
    isModalCoinVisible: false,
    setIsModalCoinVisible: mockSetIsModalCoinVisible,
    activeFilter: "ALL" as const,
    setActiveFilter: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default states and not fetch data if modal is not visible", () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...baseContextMock,
      isModalCoinVisible: false,
      selectedCoinId: "bitcoin",
    });

    const { result } = renderHook(() => useCoinModalData());

    expect(result.current.isModalCoinVisible).toBe(false);
    expect(result.current.selectedCoinId).toBe("bitcoin");
    expect(result.current.chartData).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(getCoinHistoricalData).not.toHaveBeenCalled();
  });

  it("should successfully fetch and set chart data when modal opens with a selected coin", async () => {
    const mockChartData = [
      { x: 1716380000000, y: 65000 },
      { x: 1716384000000, y: 65500 },
    ];

    vi.mocked(useAppContext).mockReturnValue({
      ...baseContextMock,
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      selectedDays: 7,
    });

    vi.mocked(getCoinHistoricalData).mockResolvedValue(mockChartData);

    const { result } = renderHook(() => useCoinModalData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.chartData).toEqual(mockChartData);
    expect(result.current.error).toBeNull();
    expect(getCoinHistoricalData).toHaveBeenCalledWith("bitcoin", 7);
  });

  it("should set an error message when the API request fails", async () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...baseContextMock,
      isModalCoinVisible: true,
      selectedCoinId: "ethereum",
    });

    vi.mocked(getCoinHistoricalData).mockRejectedValue(new Error("API Down"));

    const { result } = renderHook(() => useCoinModalData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.chartData).toEqual([]);
    expect(result.current.error).toBe(
      "Failed to load historical charts. Please try again.",
    );
  });

  it("should close the modal and clear chart data when handleClose is invoked", async () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...baseContextMock,
      isModalCoinVisible: true,
      selectedCoinId: "solana",
    });

    vi.mocked(getCoinHistoricalData).mockResolvedValue([{ x: 123, y: 456 }]);

    const { result } = renderHook(() => useCoinModalData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleClose();
    });

    expect(mockSetIsModalCoinVisible).toHaveBeenCalledWith(false);
    expect(result.current.chartData).toEqual([]);
  });

  it("should re-fetch historical data when selectedDays is updated", async () => {
    let currentMockContext = {
      ...baseContextMock,
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      selectedDays: 7,
    };

    vi.mocked(useAppContext).mockImplementation(() => currentMockContext);
    vi.mocked(getCoinHistoricalData).mockResolvedValue([{ x: 1, y: 100 }]);

    const { rerender } = renderHook(() => useCoinModalData());

    await waitFor(() => {
      expect(getCoinHistoricalData).toHaveBeenCalledWith("bitcoin", 7);
    });

    currentMockContext = {
      ...currentMockContext,
      selectedDays: 30,
    };

    rerender();

    await waitFor(() => {
      expect(getCoinHistoricalData).toHaveBeenCalledWith("bitcoin", 30);
    });

    expect(getCoinHistoricalData).toHaveBeenCalledTimes(2);
  });
});
