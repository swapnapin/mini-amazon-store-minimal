import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "store.spec.js",
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: [
    {
      command: "python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 18000",
      url: "http://127.0.0.1:18000/health",
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        ...process.env,
        DATABASE_URL: "sqlite:////tmp/mini-amazon-store-e2e.db",
      },
    },
    {
      command: "npm --prefix frontend run dev -- --host 127.0.0.1 --port 15173",
      url: "http://127.0.0.1:15173",
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        ...process.env,
        VITE_API_PROXY_TARGET: "http://127.0.0.1:18000",
      },
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:15173",
    headless: true,
    trace: "retain-on-failure",
  },
});
