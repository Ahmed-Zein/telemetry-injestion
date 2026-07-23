// cypod-telemetry

import { Redis } from "ioredis";
import { config } from "../../config/index.js";
import { logger } from "../../utils/logger.js";

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

redis.on("error", (err) => {
  logger.error(err, "Redis connection error:");
});
