import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDataContext } from "./useDataContext";

describe("useDataContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with empty favorites if localStorage is empty", () => {
    const { result } = renderHook(() => useDataContext());
    expect(result.current.favorites).toEqual([]);
  });

  it("should initialize with existing data from localStorage", () => {
    const mockFavorites = ["bitcoin", "ethereum"];
    localStorage.setItem("@krypto:favorites", JSON.stringify(mockFavorites));

    const { result } = renderHook(() => useDataContext());
    expect(result.current.favorites).toEqual(mockFavorites);
  });

  it("should add a new favorite and save it to localStorage", () => {
    const { result } = renderHook(() => useDataContext());
    act(() => {
      result.current.toggleFavorite("solana");
    });
    expect(result.current.favorites).toEqual(["solana"]);
    expect(localStorage.getItem("@krypto:favorites")).toBe(
      JSON.stringify(["solana"]),
    );
  });

  it("should remove a favorite if it is already in localStorage", () => {
    localStorage.setItem("@krypto:favorites", JSON.stringify(["bitcoin"]));
    const { result } = renderHook(() => useDataContext());
    act(() => {
      result.current.toggleFavorite("bitcoin");
    });
    expect(result.current.favorites).toEqual([]);
    expect(localStorage.getItem("@krypto:favorites")).toBe(JSON.stringify([]));
  });

  it("should initialize with selectedCoinId as null", () => {
    const { result } = renderHook(() => useDataContext());
    expect(result.current.selectedCoinId).toBeNull();
  });

  it("should update selectedCoinId correctly", () => {
    const { result } = renderHook(() => useDataContext());
    act(() => {
      result.current.setSelectedCoinId("bitcoin");
    });
    expect(result.current.selectedCoinId).toBe("bitcoin");
  });
});
