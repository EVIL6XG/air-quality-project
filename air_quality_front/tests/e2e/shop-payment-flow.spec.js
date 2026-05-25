import { expect, test } from "@playwright/test"

test("authenticated user can open Stripe checkout from cart", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("token", "e2e-token")
  })

  await page.route("**/api/shop/cart", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: 1,
            product_id: 101,
            name: "AirQ Pocket Monitor",
            qty: 1,
            price_cents: 8900,
            line_total_cents: 8900,
          },
        ],
        total_cents: 8900,
      }),
    })
  })

  await page.route("**/api/payments/create-checkout-session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        checkout_url: "http://127.0.0.1:3000/shop/orders?paid=1",
        session_id: "cs_test_123",
        order_id: 77,
      }),
    })
  })

  await page.route("**/api/shop/orders", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 77,
          total_cents: 8900,
          items: [{ product_id: 101, name: "AirQ Pocket Monitor", qty: 1, line_total_cents: 8900 }],
        },
      ]),
    })
  })

  await page.goto("/shop/cart")
  await page.getByRole("button", { name: "Pay with card" }).click()
  await expect(page).toHaveURL(/\/shop\/orders\?paid=1/)
  await expect(page.getByText("Order History")).toBeVisible()
})
