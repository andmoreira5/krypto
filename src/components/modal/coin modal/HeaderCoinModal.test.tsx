import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { HeaderCoinModal } from "./HeaderCoinModal";
import { useAppContext } from "../../../context/hooks/useAppContext";

vi.mock("../../../context/hooks/useAppContext", () => ({
  useAppContext: vi.fn(),
}));

describe("HeaderCoinModal Component", () => {
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the placeholder 'Loading...' when selectedCoinId is not available", () => {
    vi.mocked(useAppContext).mockReturnValue({
      selectedCoinId: null,
    } as ReturnType<typeof useAppContext>);

    render(<HeaderCoinModal handleClose={mockHandleClose} />);

    expect(screen.getByText("Coin Analytics")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /loading\.\.\./i }),
    ).toBeInTheDocument();
  });

  it("should render the coin identity correctly when selectedCoinId is provided", () => {
    vi.mocked(useAppContext).mockReturnValue({
      selectedCoinId: "bitcoin",
    } as ReturnType<typeof useAppContext>);

    render(<HeaderCoinModal handleClose={mockHandleClose} />);

    expect(screen.getByText("Coin Analytics")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /bitcoin/i }),
    ).toBeInTheDocument();
  });

  it("should trigger handleClose when the close button is clicked", () => {
    vi.mocked(useAppContext).mockReturnValue({
      selectedCoinId: "ethereum",
    } as ReturnType<typeof useAppContext>);

    render(<HeaderCoinModal handleClose={mockHandleClose} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
