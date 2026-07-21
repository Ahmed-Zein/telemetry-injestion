import express from "express";

const router = express.Router();
/*
### [ ] Reads
- `GET /devices/:id/latest` — served from cache when warm; on a miss, fall back to the
  database and repopulate the cache. Log which path was hit (`HIT` / `MISS`) — we will
  ask you about this.
- `GET /devices/:id/history?from=&to=` — paginated
*/

router.get("/:id/latest", (req, res) => {
  // Latest telemetry retrieval logic here
});

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
