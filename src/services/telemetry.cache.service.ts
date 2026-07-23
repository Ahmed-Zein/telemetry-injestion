// cypod-telemetry
import { redis } from "../infra/cache/redis.js";
import { Telemetry } from "../infra/db/schema.js";
import { logger } from "../utils/logger.js";

const LATEST_STATE_TTL_SECONDS = 60; // note: see README for reasoning

function cacheKey(deviceId: number) {
  return `device:${deviceId}:latest`;
}

export const telemetryCache = {
  async get(deviceId: number): Promise<Telemetry | undefined> {
    const cached = await redis.get(cacheKey(deviceId));
    if (cached) {
      logger.info({ deviceId }, "cache HIT");
      return JSON.parse(cached);
    }
    logger.info({ deviceId }, "cache MISS");
    return undefined;
  },

  async set(deviceId: number, latestState: Telemetry) {
    await redis.set(
      cacheKey(deviceId),
      JSON.stringify(latestState),
      "EX",
      LATEST_STATE_TTL_SECONDS,
    );
  },

  async invalidate(deviceId: number) {
    await redis.del(cacheKey(deviceId));
  },
};
