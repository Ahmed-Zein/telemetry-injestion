// cypod-telemetry
import express from "express";
import { JwtService } from "../services/jwt.service.js";
import { createAuthMiddleware } from "../middlewares/auth.js";
import { devicesController } from "../controllers/devices.controller.js";

const router = express.Router();

const jwtService = new JwtService();
const authMiddleware = createAuthMiddleware(jwtService);

// All device and telemetry routes require a valid token
router.use(authMiddleware);

/*
### [ ] Reads
- `GET /devices/:id/latest` — served from cache when warm; on a miss, fall back to the
  database and repopulate the cache. Log which path was hit (`HIT` / `MISS`) — we will
  ask you about this.
- `GET /devices/:id/history?from=&to=` — paginated
*/

router.get("/", devicesController.getAll);
router.post("/", devicesController.create);

router.get("/:id/latest", (req, res) => {});

router.get("/:id/history", (req, res) => {
  // Telemetry history retrieval logic here
});

/*
### [ ] Telemetry ingestion
- `POST /devices/:id/telemetry` — accepts `{ battery, temperature, lat, lng, status, timestamp }`
- Validate the payload before storing anything
- Store the event
- Update the cached "latest state" for that device, with a TTL
- Raise an alert when a reading crosses a threshold (e.g. battery below 15%, or
  temperature above a configurable maximum)
*/

router.post("/:id/telemetry", (req, res) => {
  // Telemetry ingestion logic here
});

export default router;
