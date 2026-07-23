// cypod-telemetry
import express from "express";
import { telemetryController } from "../controllers/telemetry.controller.js";
import { telemetrySchema } from "../dtos/telemety.dto.js";
import { slidingWindowRateLimit } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { validateId } from "../middlewares/validateId.js";
import { redis } from "../infra/cache/redis.js";

const router = express.Router();

const telemetryRateLimit = slidingWindowRateLimit(
  { maxRequests: 10, windowSeconds: 60, keyPrefix: "rate:telemetry" },
  redis,
);

router.post(
    "/:id/telemetry",
    validateId,
    telemetryRateLimit,
    validate(telemetrySchema),
    telemetryController.create,
);

export default router;
