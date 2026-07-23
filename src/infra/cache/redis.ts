// cypod-telemetry

import { Redis } from "ioredis";
import { logger } from "../../utils/logger.js";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redis.on("error", (err) => {
  logger.error(err, "Redis connection error:");
});
