// cypod-telemetry
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const STORAGE_KEYS = {
  TOKEN: "cypodo-token",
  USER: "cypodo-user",
  LOCALE: "cypodo-locale",
} as const;
