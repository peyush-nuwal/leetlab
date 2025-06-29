// src/config.js
export const GOOGLE_AUTH_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/v1/auth/google"
    : "https://your-api.onrender.com/api/v1/auth/google";
