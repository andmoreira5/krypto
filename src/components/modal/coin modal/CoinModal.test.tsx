import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { CoinModal } from "./CoinModal";
import { useCoinModalData } from "./hooks/useCoinModal";

vi.mock("./hooks/useCoinModal", () => ({
  useCoinModalData: vi.fn(),
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

  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(screen.queryByTestId("modalChartContainer")).not.toBeInTheDocument();
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
    expect(screen.getByTestId("modalChartContainer")).toBeInTheDocument();
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

    const overlay = screen.getByTestId("coinModalOverlay");
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

    const content = screen.getByTestId("coinModalContent");
    fireEvent.click(content);

    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
