# Krypto — Testing

## Overview

Krypto uses a layered testing strategy to validate both isolated application logic and complete user workflows.

The testing architecture is divided into two main layers:

- **Unit and integration testing:** Vitest and React Testing Library
- **End-to-end testing:** Playwright

The goal is to validate application behavior from different levels while keeping tests deterministic and independent from external API availability.

### Unit and Integration Testing

Unit and integration tests focus on individual application pieces and their interactions.

They cover:

- React components
- Custom hooks
- React Context
- User interactions
- Loading states
- Error states
- Application state transitions

### End-to-End Testing

End-to-end tests validate complete user workflows in a real browser environment.

They cover:

- Dashboard interactions
- Cryptocurrency search
- Coin selection
- Modal behavior
- Historical timeframe changes
- API request behavior
- Network failure scenarios
- Cross-browser behavior

This separation allows fast feedback during development while also providing confidence that the main user flows work correctly in the browser.

---

## Testing Stack

| Tool                  | Responsibility                                 |
| --------------------- | ---------------------------------------------- |
| Vitest                | Test runner for unit and integration tests     |
| React Testing Library | Testing React components and user interactions |
| Playwright            | End-to-end browser testing                     |
| jsdom                 | Browser-like environment for Vitest            |
| Vite                  | Test configuration and application tooling     |

---

## Test Organization

The project separates browser-level E2E tests from tests located alongside application source files.

```text
/
├── src/
│   ├── components/
│   │   └── ...
│   ├── context/
│   │   └── ...
│   ├── hooks/
│   │   └── ...
│   └── test/
│       ├── setup.ts
│       ├── mocks/
│       └── utils/
│
└── tests/
    ├── e2e/
    │   └── ...
    └── mock/
        └── ...
```

### Source Tests

Unit and integration tests are located close to the code they validate.

Examples:

```text
src/components/cards/
├── CoinCard.tsx
└── CoinCard.test.tsx
```

```text
src/hooks/
├── useCoins.ts
└── useCoins.test.ts
```

This organization makes it easier to identify the tests associated with each implementation.

### E2E Tests

End-to-end tests are centralized under:

```text
tests/e2e/
```

These tests interact with the application through a real browser and validate complete user workflows.

Shared E2E mock data is stored under:

```text
tests/mock/
```

---

## Unit and Integration Testing

Vitest is used for unit and integration testing.

The Vitest configuration is defined inside:

```text
vite.config.ts
```

There is no separate `vitest.config.ts` file.

The current configuration uses:

```text
globals: true
environment: jsdom
setupFiles: ./src/test/setup.ts
```

The `jsdom` environment provides a browser-like environment for testing React components.

The shared setup file is:

```text
src/test/setup.ts
```

---

## What Is Tested

The unit and integration test suite covers different parts of the application.

### Components

Component tests validate rendering and user interactions.

Examples include:

- `CoinCard`
- `ListCoins`
- `Sparkline`
- `CoinModal`
- `HeaderCoinModal`
- `ErrorCoinModal`

These tests focus on observable component behavior rather than implementation details.

### Hooks

Custom hooks are tested independently when they contain meaningful application logic.

Examples include:

- `useCoins`
- `useDataContext`
- `useCoinModalData`

The goal is to verify state transitions, asynchronous behavior, and interactions with application services.

### Context

Application-level state is also covered by tests.

The context layer manages state such as:

```text
selectedCoinId
selectedDays
favorites
isModalCoinVisible
activeFilter
```

Tests validate that this shared state can be accessed and updated correctly by consumers.

---

## Testing User Behavior

The tests prioritize observable behavior.

Instead of testing internal implementation details, the test suite generally interacts with components through the same mechanisms available to users.

Examples include:

```text
Click a coin card
Search for a cryptocurrency
Clear the search
Open the modal
Change the chart timeframe
Press Escape
Click the close button
```

This approach helps ensure that tests remain focused on application behavior rather than becoming tightly coupled to the internal implementation.

---

## End-to-End Testing

Playwright is used for end-to-end testing.

The Playwright configuration is located in:

```text
playwright.config.ts
```

The E2E test directory is:

```text
tests/
```

The configured test directory is:

```text
./tests
```

The current E2E suite validates complete workflows in a real browser environment.

---

## Browser Coverage

Playwright is configured to execute the E2E suite against three browser engines:

```text
Chromium
Firefox
WebKit
```

This provides cross-browser coverage for the main application workflows.

The configured Playwright projects are:

```text
chromium → Desktop Chrome
firefox  → Desktop Firefox
webkit   → Desktop Safari
```

Mobile browser projects are currently not enabled.

---

## E2E Test Scenarios

The current E2E tests cover the main dashboard and coin-detail workflows.

### Home Page

The dashboard tests verify:

- Header rendering
- Krypto branding
- Search input rendering
- Cryptocurrency card rendering
- Number of rendered cards
- Search filtering
- Empty search results
- Clearing the search
- Market refresh
- Market API failure handling

For example, the test suite verifies that the number of rendered coin cards matches the mocked dataset.

```text
Mock data
    ↓
Coin list
    ↓
Rendered cards
    ↓
Expected number of cards
```

### Coin Modal

The coin modal tests verify:

- Opening the modal from a coin card
- Displaying the selected coin
- Switching between timeframes
- Requesting historical data
- Highlighting the selected timeframe
- Closing through the close button
- Closing through the Escape key
- Handling historical API failures

The supported timeframes are:

```text
1D
7D
1M
```

---

## API Mocking

External CoinGecko API requests are mocked during E2E tests.

This is an important part of the testing strategy because the application depends on an external API.

Tests intercept requests such as:

```text
/api/v3/coins/markets
/api/v3/coins/*/market_chart
```

and provide deterministic responses.

This prevents E2E tests from depending on:

- CoinGecko availability
- Network conditions
- Current cryptocurrency market data
- External API response changes
- API rate limits

---

## Successful API Scenarios

The market endpoint is mocked with controlled cryptocurrency data.

Example flow:

```text
Playwright
    ↓
Intercept CoinGecko request
    ↓
Return mockCoinsList
    ↓
Application receives predictable data
    ↓
UI renders the mocked coins
```

Historical chart requests are also mocked.

For example, a historical response can contain:

```json
{
  "prices": [[1716380000000, 65000]]
}
```

This allows the tests to verify that the chart-related UI reacts correctly without requiring real historical market data.

---

## API Failure Scenarios

The E2E suite explicitly tests API failures.

The market endpoint can be configured to return:

```text
HTTP 500
```

The test then verifies that the application displays the expected error state.

Historical chart requests are also tested with server errors.

This validates the application's behavior when external data cannot be retrieved.

The expected behavior is not only that the request fails, but that the user receives an appropriate error message and recovery interface.

---

## Network Request Validation

Some tests validate the actual request generated by the application.

For example, when the user selects the `1D` timeframe, the test waits for a request containing:

```text
market_chart
days=1
```

The test then verifies:

```text
HTTP method = GET
```

and confirms that the `1D` button becomes visually active.

This validates the connection between user interaction, application state, and API communication.

---

## Playwright Configuration

The Playwright configuration contains the following important settings.

### Base URL

The configured application URL is:

```text
http://localhost:5173
```

This allows tests to navigate using the application's local development server.

### Test IDs

Playwright is configured to use:

```text
data-testid
```

as its test ID attribute.

For example:

```tsx
data-testid="coin-card"
```

Tests can then locate the element with:

```ts
page.getByTestId("coin-card");
```

This provides explicit selectors for elements where semantic selectors are not sufficient.

### Parallel Execution

Tests are configured to run fully in parallel:

```text
fullyParallel: true
```

This allows independent tests to execute concurrently.

### CI Retries

When running in CI:

```text
retries = 2
workers = 1
```

This provides additional resilience to transient failures while limiting parallel execution in CI.

Locally, retries are disabled:

```text
retries = 0
```

### HTML Reporter

Playwright uses the HTML reporter:

```text
reporter: "html"
```

This allows test results to be inspected through a generated report.

### Trace Collection

Playwright collects traces on the first retry:

```text
trace: "on-first-retry"
```

This provides additional debugging information when a test fails and is retried.

---

## Running Tests

### Unit and Integration Tests

Run the Vitest test suite with:

```bash
npm run test
```

Vitest runs in watch mode by default according to the configured script.

```json
"test": "vitest"
```

### End-to-End Tests

Run the Playwright E2E suite with:

```bash
npm run test:e2e
```

### Playwright UI Mode

For an interactive Playwright testing experience:

```bash
npm run test:e2e:ui
```

This is useful during development because it provides a visual interface for inspecting and executing E2E tests.

---

## Test Environment

Unit and integration tests use:

```text
jsdom
```

This provides browser-like APIs required by React components.

Playwright tests execute against actual browser engines:

```text
Chromium
Firefox
WebKit
```

This creates a distinction between the two testing layers:

```text
Vitest
    ↓
jsdom
    ↓
Component / hook behavior

Playwright
    ↓
Real browser
    ↓
Complete user workflows
```

---

## Test Isolation

The test suite avoids relying on live external API responses.

Instead, API interactions are intercepted and mocked during E2E tests.

This provides:

- deterministic test results;
- reproducible failure scenarios;
- faster execution;
- independence from external services;
- predictable test data.

The application can therefore be tested against both successful and unsuccessful API scenarios without changing the production API implementation.

---

## Testing Principles

The testing strategy follows several principles.

### Test Behavior Over Implementation

Tests should verify what the user can see and do instead of relying heavily on internal implementation details.

### Isolate External Dependencies

External APIs should not determine whether the automated test suite passes or fails.

### Test Failure States

Network failures are treated as expected application scenarios and are explicitly tested.

### Validate User Workflows

Important application flows should be validated from the user's perspective.

### Keep Tests Deterministic

Mocked API responses provide stable input and predictable output.

### Maintain Multiple Testing Layers

Unit and integration tests provide fast feedback for isolated functionality, while E2E tests validate complete workflows.

---

## Current Test Coverage Areas

The current automated tests cover the following areas:

| Area                   | Unit / Integration | E2E |
| ---------------------- | -----------------: | --: |
| Coin cards             |                Yes | Yes |
| Coin list              |                Yes | Yes |
| Search                 |    Component-level | Yes |
| Favorites              |                Yes |   - |
| Application context    |                Yes |   - |
| Coin modal             |                Yes | Yes |
| Historical chart       |                Yes | Yes |
| Timeframe selection    |                Yes | Yes |
| Modal close button     |                Yes | Yes |
| Escape key             |                  - | Yes |
| API success            |                Yes | Yes |
| API failure            |                Yes | Yes |
| Market refresh         |                  - | Yes |
| Cross-browser behavior |                  - | Yes |

This table describes the current testing strategy rather than a formal code-coverage percentage.

---

## Commands Reference

| Command               | Purpose                   |
| --------------------- | ------------------------- |
| `npm run test`        | Run Vitest tests          |
| `npm run test:e2e`    | Run Playwright E2E tests  |
| `npm run test:e2e:ui` | Run Playwright in UI mode |

---

## Future Improvements

Potential improvements to the testing strategy include:

- Adding test coverage reporting.
- Adding explicit accessibility testing.
- Adding visual regression testing for critical UI states.
- Adding mobile viewport E2E scenarios.
- Adding CI execution for the complete test suite.
- Increasing coverage of edge cases around localStorage failures.
- Adding more tests for API response validation.

These are potential improvements rather than requirements for the current implementation.

---

## Summary

Krypto uses a layered testing strategy combining fast component-level tests with complete browser-based workflows.

The testing strategy is divided into two complementary layers:

| Layer              | Tools                          | Focus                                                                          |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------ |
| Unit & Integration | Vitest + React Testing Library | Components, hooks, context, state, and user interactions                       |
| End-to-End         | Playwright                     | Complete user workflows, browser behavior, API requests, and failure scenarios |

Unit and integration tests provide fast feedback during development, while E2E tests validate the application from the user's perspective across Chromium, Firefox, and WebKit.

External API dependencies are isolated through request mocking, making the automated test suite deterministic and independent from CoinGecko availability.
