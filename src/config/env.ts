// cypod-telemetry
import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

function numberEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (isNaN(parsed)) {
    throw new Error(`Env var ${key} must be a number, got: "${raw}"`);
  }
  return parsed;
}

export const config = {
  server: {
    port: numberEnv("PORT", 3000),
    corsOrigin: optionalEnv("CORS_ORIGIN", "http://localhost:5173"),
  },
  database: {
    url: requireEnv("DATABASE_URL"),
  },
  redis: {
    host: optionalEnv("REDIS_HOST", "localhost"),
    port: numberEnv("REDIS_PORT", 6379),
  },
  jwt: {
    accessTokenSecret: requireEnv("JWT_ACCESS_SECRET"),
    refreshTokenSecret: requireEnv("JWT_REFRESH_SECRET"),
    accessExpiresIn: optionalEnv("JWT_ACCESS_EXPIRES_IN", "7d"),
    refreshExpiresIn: optionalEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },
  bcrypt: {
    saltRounds: numberEnv("BCRYPT_SALT_ROUNDS", 10),
  },
  telemetry: {
    minTemperature: numberEnv("TEMPERATURE_MIN", 0),
    maxTemperature: numberEnv("TEMPERATURE_MAX", 100),
    maxTimestampAgeDays: numberEnv("TIMESTAMP_MAX_AGE_DAYS", 30),
  },
  alerts: {
    lowBatteryPercent: numberEnv("LOW_BATTERY_THRESHOLD", 15),
    highTemperatureCelsius: numberEnv("HIGH_TEMPERATURE_THRESHOLD", 45),
  },
};
