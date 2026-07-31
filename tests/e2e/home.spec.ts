import test, { expect } from "@playwright/test";
import { mockCoinsList } from "../mocks/list.mock";

test.describe("Home Page - Kripto Dashboard", () => {
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

  test("should display the header with Kripto logo and search input", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", { name: /krypto/i })).toBeVisible();

    const searchInput = page.getByTestId("search-coin");
    await expect(searchInput).toBeVisible();
  });

  test("should render the exact number of coin cards as defined in the mock data", async ({
    page,
  }) => {
    const coinCards = page.getByTestId("coin-card");

    await expect(coinCards).toHaveCount(mockCoinsList.length);
  });

  test('should display "No coins found" message when search has no matches', async ({
    page,
  }) => {
    const searchInput = page.getByTestId("search-coin");
    await searchInput.fill("NonExistentCoin123");
    await expect(page.getByTestId("coin-card")).toHaveCount(0);
    await expect(page.getByText(/No coins found matching/i)).toBeVisible();
  });

  test("should clear search input and restore list when clicking search clear button", async ({
    page,
  }) => {
    const searchInput = page.getByTestId("search-coin");

    await searchInput.fill("Bitcoin");

    const clearButton = page.getByTestId("button-search-coin");
    await expect(clearButton).toBeVisible();
    clearButton.click();

    await expect(searchInput).toHaveValue("");
    await expect(page.getByTestId("coin-card")).toHaveCount(
      mockCoinsList.length,
    );
  });

  test("should re-fetch market data when clicking the refresh header button", async ({
    page,
  }) => {
    const responsePromise = page.waitForResponse("**/api/v3/coins/markets*");

    const refreshButton = page.getByTestId("update-market");
    await refreshButton.click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });
});

test.describe("Home Page - Error Handling", () => {
  test("should display ErrorState component when API call fails", async ({
    page,
  }) => {
    await page.route(/\/api\/v3\/coins\/markets/, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.goto("/");

    await expect(page.getByText(/syncing market data/i)).toBeHidden({
      timeout: 10000,
    });

    await expect(
      page.getByRole("button", { name: /try again/i }),
    ).toBeVisible();
    await expect(page.getByText(/connection interrupted/i)).toBeVisible();
  });
});
