import { test, expect } from "@playwright/test";

async function login(page) {
  await page.goto("/");
  await page.getByLabel("Username").fill("testuser");
  await page.getByLabel("Password").fill("Test@123");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Welcome, testuser!")).toBeVisible();
}

test("store loads products", async ({ page }) => {
  await login(page);
  await expect(page.getByText("iPhone 16")).toBeVisible();
});

test("search filters products", async ({ page }) => {
  await login(page);
  await page.getByPlaceholder("Search phones, laptops, tablets...").fill("Samsung");
  await expect(page.getByText("Galaxy S25")).toBeVisible();
  await expect(page.getByText("iPhone 16")).not.toBeVisible();
});

test("completes a server-backed demo checkout", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Add to Cart" }).first().click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByLabel("Email for invoice").fill("test@example.com");
  await page.getByLabel("Name on Card").fill("Test User");
  await page.getByLabel("Card Number").fill("4111111111111111");
  await page.getByLabel("Expiry (MM/YY)").fill("12/30");
  await page.getByLabel("CVV").fill("123");
  await page.getByRole("button", { name: /Pay \$/ }).click();
  await expect(page.getByRole("heading", { name: "Payment Successful!" })).toBeVisible();
  await expect(page.getByRole("definition").filter({ hasText: "$999.00" })).toBeVisible();
});
