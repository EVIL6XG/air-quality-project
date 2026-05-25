import { expect, test } from "@playwright/test"

test("guest is redirected to login for protected shop cart route", async ({ page }) => {
  await page.goto("/shop/cart")
  await expect(page.getByPlaceholder("Email address")).toBeVisible()
})
