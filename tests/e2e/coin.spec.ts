import test, { expect } from "@playwright/test";
import { mockCoinsList } from "../mocks/list.mock";

test.describe("Coin Card Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v3/coins/markets*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        json: mockCoinsList,
      });
    });

    await page.goto("/");
  });

  test("should open coin detail modal when clicking a coin card and close it via close button", async ({
    page,
  }) => {
    const firstCoin = mockCoinsList[0];

    const coinCards = page.getByTestId("coin-card");
    await expect(coinCards.first()).toBeVisible();

    await coinCards.first().click();

    const modalContent = page.getByTestId("coin-modal-content");
    await expect(modalContent).toBeVisible();

    const nameRegex = new RegExp(firstCoin.name || firstCoin.id!, "i");
    await expect(page.getByTestId("coin-modal-title")).toContainText(nameRegex);

    const closeButton = page.getByTestId("close-modal-button");
    await closeButton.click();

    await expect(modalContent).toBeHidden();
  });

  test("should display correct details when clicking a different coin card", async ({
    page,
  }) => {
    test.skip(mockCoinsList.length < 2);

    const secondCoin = mockCoinsList[1];
    const coinCards = page.getByTestId("coin-card");

    await coinCards.nth(1).click();

    const modalContent = page.getByTestId("coin-modal-content");
    await expect(modalContent).toBeVisible();

    const secondCoinNameRegex = new RegExp(
      secondCoin.name || secondCoin.id!,
      "i",
    );
    await expect(page.getByTestId("coin-modal-title")).toContainText(
      secondCoinNameRegex,
    );
  });

  test("should refetch chart data and highlight button when changing timeframes", async ({
    page,
  }) => {
    await page.route("**/api/v3/coins/*/market_chart*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        json: { prices: [[1716380000000, 65000]] },
      });
    });

    const coinCards = page.getByTestId("coin-card");
    await coinCards.first().click();

    const chartRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes("/api/v3/coins/") &&
        request.url().includes("market_chart") &&
        request.url().includes("days=1"),
    );

    const btn1D = page.getByTestId("timeframe-btn-1D");
    await btn1D.click();

    const request = await chartRequestPromise;

    expect(request.method()).toBe("GET");

    await expect(btn1D).toHaveClass(/bg-blue-600/);
  });

  test("should display error message when chart request fails", async ({
    page,
  }) => {
    await page.route("**/api/v3/coins/*/market_chart*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        json: { error: "failed do fetch data" },
      });
    });

    const coinCards = page.getByTestId("coin-card");
    await coinCards.first().click();

    await expect(
      page.getByText("Failed to load historical charts. Please try again."),
    ).toBeVisible();
  });
});
