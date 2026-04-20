import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHookWithClient } from "../test/utils/renderWithClient";
import { mockCoin } from "../test/mocks/mockCoin";

vi.mock("../services/coinGeckoApi", () => ({
  getCoinGeckoMarkets: vi.fn(),
}));

import { useCoins } from "./useCoins";
import { getCoinGeckoMarkets } from "../services/coinGeckoApi";

describe("useCoins Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch coins and handle success state", async () => {
    const mockCoinsList = [mockCoin];
    vi.mocked(getCoinGeckoMarkets).mockResolvedValue(mockCoinsList);
    const { result } = renderHookWithClient(() => useCoins());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockCoinsList);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle API errors correctly", async () => {
    vi.mocked(getCoinGeckoMarkets).mockRejectedValue(new Error("API Error"));
    const { result } = renderHookWithClient(() => useCoins());
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });
});
