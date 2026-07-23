// cypod-telemetry
import express, { Request, Response } from "express";
import { JwtService } from "../services/jwt.service.js";
import { createAuthMiddleware } from "../middlewares/auth.js";
import { devicesController } from "../controllers/devices.controller.js";
import { telemetryController } from "../controllers/telemetry.controller.js";
import { validate } from "../middlewares/validate.js";
import { telemetrySchema } from "../dtos/telemety.dto.js";

const router = express.Router();

const jwtService = new JwtService();
const authMiddleware = createAuthMiddleware(jwtService);

// All device and telemetry routes require a valid token
router.use(authMiddleware);

router.get("/", devicesController.getAll);
router.post("/", devicesController.create);

/*
### [ ] Reads
- `GET /devices/:id/latest` — served from cache when warm; on a miss, fall back to the
  database and repopulate the cache. Log which path was hit (`HIT` / `MISS`) — we will
  ask you about this.
- `GET /devices/:id/history?from=&to=` — paginated
*/
// TODO: return paginated result
router.get("/:id/history", telemetryController.getAll);

// TODO: Last step after adding the redis cache
router.get("/:id/latest", telemetryController.latest);

/*
### [ ] Telemetry ingestion
- `POST /devices/:id/telemetry` — accepts `{ battery, temperature, lat, lng, status, timestamp }`
- Validate the payload before storing anything
- Store the event
- Update the cached "latest state" for that device, with a TTL
- Raise an alert when a reading crosses a threshold (e.g. battery below 15%, or
  temperature above a configurable maximum)
*/
router.post(
  "/:id/telemetry",
  validate(telemetrySchema),
  telemetryController.create,
);

export default router;
