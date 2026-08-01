import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { CoinModal } from "./CoinModal";
import { useCoinModalData } from "./hooks/useCoinModal";
import { useAppContext } from "../../../context/hooks/useAppContext";

vi.mock("./hooks/useCoinModal", () => ({
  useCoinModalData: vi.fn(),
}));

vi.mock("../../../context/hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("./HeaderCoinModal", () => ({
  HeaderCoinModal: ({ handleClose }: { handleClose: () => void }) => (
    <div data-testid="mock-header">
      <button onClick={handleClose}>Close from Header</button>
    </div>
  ),
}));

vi.mock("./ErrorCoinModal", () => ({
  ErrorCoinModal: ({ error }: { error: string }) => (
    <div data-testid="mock-error">{error}</div>
  ),
}));

vi.mock("./SkeletonCoinModal", () => ({
  SkeletonCoinModal: () => <div data-testid="mock-skeleton">Loading...</div>,
}));

vi.mock("recharts", async () => {
  const original = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe("CoinModal Component", () => {
  const mockHandleClose = vi.fn();
  const mockSetSelectedDays = vi.fn();

  const baseContextMock = {
    selectedDays: 7,
    setSelectedDays: mockSetSelectedDays,
    selectedCoinId: "bitcoin",
    setSelectedCoinId: vi.fn(),
    favorites: [] as string[],
    toggleFavorite: vi.fn(),
    isModalCoinVisible: true,
    setIsModalCoinVisible: vi.fn(),
    activeFilter: "ALL" as const,
    setActiveFilter: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppContext).mockReturnValue(baseContextMock);
  });

  it("should render nothing when isModalCoinVisible is false", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: false,
      selectedCoinId: null,
      chartData: [],
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    const { container } = render(<CoinModal />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the skeleton loader when isLoading is true", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: true,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);
    expect(screen.getByTestId("mock-skeleton")).toBeInTheDocument();
    expect(
      screen.queryByTestId("modal-chart-container"),
    ).not.toBeInTheDocument();
  });

  it("should render the error component when an error occurs", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: false,
      error: "Failed to fetch data",
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);
    expect(screen.getByTestId("mock-error")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });

  it("should render the chart container successfully when chartData is provided", () => {
    const mockData = [
      { x: 1716380000000, y: 65000.5 },
      { x: 1716384000000, y: 65200.0 },
    ];

    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: mockData,
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("modal-chart-container")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-skeleton")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-error")).not.toBeInTheDocument();
  });

  it("should trigger handleClose when clicking on the overlay backdrop", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);

    const overlay = screen.getByTestId("coin-modal-overlay");
    fireEvent.click(overlay);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("should not trigger handleClose when clicking inside the modal content box due to stopPropagation", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);

    const content = screen.getByTestId("coin-modal-content");
    fireEvent.click(content);

    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it("should render timeframe buttons with active state based on selectedDays", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    vi.mocked(useAppContext).mockReturnValue({
      ...baseContextMock,
      selectedDays: 30,
    });

    render(<CoinModal />);

    const btn1D = screen.getByTestId("timeframe-btn-1D");
    const btn7D = screen.getByTestId("timeframe-btn-7D");
    const btn1M = screen.getByTestId("timeframe-btn-1M");

    expect(btn1D).toBeInTheDocument();
    expect(btn7D).toBeInTheDocument();
    expect(btn1M).toBeInTheDocument();

    expect(btn1M.className).toContain("bg-blue-600");
    expect(btn1D.className).not.toContain("bg-blue-600");
  });

  it("should call setSelectedDays with correct value when a timeframe button is clicked", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: false,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);

    const btn1D = screen.getByTestId("timeframe-btn-1D");
    fireEvent.click(btn1D);

    expect(mockSetSelectedDays).toHaveBeenCalledWith(1);
  });

  it("should disable timeframe buttons when chart is loading", () => {
    vi.mocked(useCoinModalData).mockReturnValue({
      isModalCoinVisible: true,
      selectedCoinId: "bitcoin",
      chartData: [],
      isLoading: true,
      error: null,
      handleClose: mockHandleClose,
    });

    render(<CoinModal />);

    const btn7D = screen.getByTestId("timeframe-btn-7D");
    expect(btn7D).toBeDisabled();
  });
});
