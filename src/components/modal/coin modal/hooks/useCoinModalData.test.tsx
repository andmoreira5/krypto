import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCoinModalData } from "./useCoinModal";
import { useAppContext } from "../../../../context/hooks/useAppContext";
import { getCoinHistoricalData } from "../../../../services/coinGeckoApi";

vi.mock("../../../../context/hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("../../../../services/coinGeckoApi", () => ({
  getCoinHistoricalData: vi.fn(),
}));

describe("useCoinModalData Custom Hook", () => {
  const mockSetIsModalCoinVisible = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return default states and not fetch data if modal is not visible", () => {
    vi.mocked(useAppContext).mockReturnValue({
      isModalCoinVisible: false,
      selectedCoinId: "bitcoin",
      setIsModalCoinVisible: mockSetIsModalCoinVisible,
    } as unknown as ReturnType<typeof useAppContext>);

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
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      setIsModalCoinVisible: mockSetIsModalCoinVisible,
    } as unknown as ReturnType<typeof useAppContext>);

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
      isModalCoinVisible: true,
      selectedCoinId: "ethereum",
      setIsModalCoinVisible: mockSetIsModalCoinVisible,
    } as unknown as ReturnType<typeof useAppContext>);

    vi.mocked(getCoinHistoricalData).mockRejectedValue(new Error("API Down"));

    const { result } = renderHook(() => useCoinModalData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.chartData).toEqual([]);
    expect(result.current.error).toBe(
      "Failed to load historical charts. Please try again.",
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("should close the modal and clear chart data when handleClose is invoked", async () => {
    vi.mocked(useAppContext).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "solana",
      setIsModalCoinVisible: mockSetIsModalCoinVisible,
    } as unknown as ReturnType<typeof useAppContext>);

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
});
