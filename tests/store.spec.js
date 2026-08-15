import { test, expect } from "@playwright/test";

test("store loads products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Mini Amazon Store")).toBeVisible();
  await expect(page.getByText("iPhone 16")).toBeVisible();
});

test("search filters products", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search mobiles...").fill("Samsung");
  await expect(page.getByText("Galaxy S25")).toBeVisible();
  await expect(page.getByText("iPhone 16")).not.toBeVisible();
});
