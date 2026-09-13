const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = typeof body.detail === "string" ? body.detail : message;
    } catch {
      // The API did not return JSON.
    }
    throw new Error(message);
  }
  return response.json();
}


export const api = {
  getProducts: (signal) => request("/products", { signal }),
  login: (username, password) => request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }),
  checkout: (payload) => request("/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
};
