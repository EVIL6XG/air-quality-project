# Testing Module (Diploma Version)

## 1) Goal
This testing module validates core quality attributes of the AirQ web application: correctness, security, payment reliability, and ML API stability.

## 2) Test Layers
- **Backend API tests (`pytest`)**: endpoint contracts, auth guards, shop/cart/order logic, Stripe session + webhook behavior, ML forecast API responses.
- **Frontend tests (`Vitest + React Testing Library`)**: component/route behavior, route protection, unauthorized shop actions.
- **End-to-end tests (`Playwright`)**: realistic user workflows in browser with controlled API mocks.

## 3) Test Folder Structure
```text
air_quality_backend/
  tests/
    conftest.py
    test_auth_api.py
    test_shop_api.py
    test_stripe_api.py
    test_ml_api.py
    test_route_protection_api.py

air_quality_front/
  tests/
    unit/
      auth-provider.test.jsx
      route-protection.test.jsx
      shop-guard.test.jsx
    e2e/
      route-protection.spec.js
      shop-payment-flow.spec.js
  vitest.config.js
  playwright.config.js
  src/test/setup.js
```

## 4) Installation and Run Commands
### Backend
```bash
cd air_quality_backend
python -m pip install -r requirements.txt
pytest -q
```

### Frontend unit/integration
```bash
cd air_quality_front
npm install
npm run test
```

### E2E
```bash
cd air_quality_front
npx playwright install
npm run test:e2e
```

## 5) What Each Group Verifies and Why It Matters

### Authentication tests
- Verify login validation, token-return contract, and protected access checks.
- Important for preventing unauthorized data access and unstable session behavior.

### Shop/Cart/Order tests
- Verify add-to-cart auth requirements, checkout response contract, and order creation path.
- Important because commerce flows are business-critical and stateful.

### Stripe tests
- Verify behavior when Stripe is misconfigured, session creation success, and webhook order finalization.
- Important because payment failures must be explicit and successful payment must atomically update order state.

### ML API tests
- Verify forecast endpoint success format (ML mode) and proper error/status handling (DL not trained).
- Important because dashboard/forecast features depend on predictable ML API contracts.

### Route protection tests
- Backend: protected routes return `401` without token.
- Frontend: private pages redirect to login; guests cannot add to cart and see sign-in prompt.
- Important for end-to-end security consistency across API and UI.

### E2E flow tests
- Verify browser-level route guard and card-payment redirection workflow.
- Important because integration issues often appear only when UI, routing, and API calls run together.

## 6) Mock Data/Examples Used
- Test JWT token: `"jwt-token"` / `"e2e-token"`
- Stripe session id: `"cs_test_123"`
- Sample product: `"AirQ Pocket Monitor"`, `price_cents=8900`
- ML sample forecast item: `{ "date": "2026-05-02", "pm25": 42 }`

## 7) Diploma-Style Explanation
The implemented testing module follows a layered strategy that combines fast isolated validation with scenario-level verification.  
At the API layer, `pytest` ensures functional correctness of authentication, commerce, payment, and ML endpoints under both success and failure conditions.  
At the presentation layer, `Vitest` + React Testing Library validates route protection and interaction logic from the user perspective.  
At the system layer, Playwright provides realistic browser workflows and detects integration regressions across routing, state, and payment flows.

This approach improves reliability by:
- detecting regressions early in CI,
- making payment and auth behavior deterministic,
- enforcing stable response contracts for frontend and ML consumers,
- reducing production defects in high-risk modules (checkout, protected routes, model endpoints).

Therefore, the testing module is suitable for a bachelor diploma project as a professional quality assurance subsystem with clear traceability between requirements and automated verification.
