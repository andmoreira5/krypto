import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { ErrorCoinModal } from "./ErrorCoinModal";

describe("ErrorCoinModal Component", () => {
  it("should render the error message correctly", () => {
    const errorMessage = "Failed to load coin statistics";
    const mockHandleClose = vi.fn();

    render(
      <ErrorCoinModal error={errorMessage} handleClose={mockHandleClose} />,
    );

    expect(screen.getByTestId("modalError")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should call handleClose when the close button is clicked", () => {
    const errorMessage = "Network Error";
    const mockHandleClose = vi.fn();

    render(
      <ErrorCoinModal error={errorMessage} handleClose={mockHandleClose} />,
    );

    const closeButton = screen.getByRole("button", {
      name: /close and try again/i,
    });
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
