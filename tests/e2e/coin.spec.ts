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
});
