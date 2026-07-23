// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import type { Redis } from "ioredis";
import { logger } from "../utils/logger.js";

export interface SlidingWindowConfig {
  maxRequests: number;
  windowSeconds: number;
  keyPrefix: string;
}

export const slidingWindowRateLimit = (
  config: SlidingWindowConfig,
  redis: Redis,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceId = req.params.id;
      const now = Math.floor(Date.now() / 1000);
      const windowSize = config.windowSeconds;
      const currWindow = Math.floor(now / windowSize);
      const prevWindow = currWindow - 1;

      const currKey = `${config.keyPrefix}:${deviceId}:${currWindow}`;
      const prevKey = `${config.keyPrefix}:${deviceId}:${prevWindow}`;

      const pipeline = redis.pipeline();
      pipeline.get(currKey);
      pipeline.get(prevKey);
      const results = await pipeline.exec();

      if (!results) {
        return next();
      }

      const currCount = parseInt((results[0][1] as string) || "0", 10);
      const prevCount = parseInt((results[1][1] as string) || "0", 10);

      const overlap = (windowSize - (now % windowSize)) / windowSize;
      const estimated = prevCount * overlap + currCount;

      const remaining = Math.max(0, Math.ceil(config.maxRequests - estimated));
      const resetSeconds = windowSize - (now % windowSize);

      res.setHeader("X-RateLimit-Limit", config.maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", resetSeconds);

      if (estimated >= config.maxRequests) {
        res.status(429).end();
        return;
      }

      const incrPipeline = redis.pipeline();
      incrPipeline.incr(currKey);
      incrPipeline.expire(currKey, windowSize * 2);
      await incrPipeline.exec();

      next();
    } catch (error) {
      logger.error({ err: error }, "Rate limiter Redis error — failing open");
      next();
    }
  };
};
