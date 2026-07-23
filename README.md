# Cypod Telemetry Service

A device telemetry ingestion service for a fleet of IoT sensors: auth, device
registration, telemetry ingestion with validation and alerting, a cache-aside
read path, rate limiting, and a React dashboard (English/Arabic, RTL-aware).

---

## 1. How to run it

**Requirements:** Docker + Docker Compose. Nothing else needs to be installed
locally — Postgres, Redis, the API, and the client all run in containers.

```bash
git clone <this-repo>
cd CypodSolutions
cp .env.example .env
docker compose up --build
```

- API: `http://localhost:3000`
- Client: `http://localhost:5173`
- Postgres: `localhost:5432` (user `admin`, db `cypod`)
- Redis: `localhost:6379`

On first boot the backend container runs `drizzle-kit push` and db:seed before starting
the server, so the schema is created automatically — no manual migration
step needed.

default username and password is: admin@cypod.com, 12345

---

## 2. What I found in the sample data, and what I did about it

`sample_telemetry.json` contains 529 readings. 525 belong to five registered
devices (`DEV-1001`–`DEV-1005`); the remaining 4 are tagged `DEV-9999`, which
is never registered by any user. Here's everything wrong with it and how the
API responds to each case:

| Issue | Example | What happens |
|---|---|---|
| Unregistered device | 4 readings for `DEV-9999` | Foreign-key violation on insert (Postgres `23503`) → caught and re-thrown as `404 device.not_found`. The whole batch for that device is rejected, since there's no device row to attach the readings to. |
| Battery out of range | `battery: 127`, `battery: -5` | Rejected at the Zod layer (`battery: z.number().min(0).max(100)`) → `400`, before anything touches the database. |
| Wrong type | `battery: "88"` (string, not number) | Rejected at the Zod layer — `z.number()` doesn't coerce strings → `400`. |
| Missing required field | one reading has no `status` | Rejected at the Zod layer → `400`. |
| Null coordinates | `lat: null, lng: null` | Rejected at the Zod layer (`z.number()` doesn't accept `null`) → `400`. |
| Extreme temperature | `temperature: 850` | **Accepted, not rejected.** Zod only checks it's a number (no range on temperature, since legitimate sensor faults can report extreme values). It's stored, but flagged `isValid: false` by the service layer against `TEMPERATURE_MIN`/`TEMPERATURE_MAX`, and excluded from alerting and threshold checks. I chose to keep the row rather than drop it — an 850°C reading is itself diagnostic information (`status: "FAULT"` on that same reading supports this), and discarding it silently would hide a real device malfunction from later analysis. |
| Exact duplicate reading | same device/timestamp/values appearing twice | **Accepted as two rows.** I don't currently deduplicate on `(deviceId, timestamp)` — see "what I didn't get to" below. |
| Extra `received_at` field | 40 readings include a `received_at` timestamp distinct from `timestamp`, sometimes ~70 minutes later | Zod strips unknown keys by default, so `received_at` is silently ignored. This turned out to be the sample data's built-in model of the offline-buffering scenario in section 6 — see next section. |

**A note on batch validation:** ingestion accepts either a single reading or
an array (`z.union([single, z.array(single).min(1).max(500)])`). Validation
runs over the whole array at once, so **one malformed reading fails the
entire batch it was sent in**, not just that reading. 
This is a real limitation — a production version would probably validate
per-item and return a partial-success response instead of all-or-nothing.
---

## 3. Reconciling the rate limit with offline-buffered readings

Both of these are true at once:

1. A device can't post more than 10 readings per minute.
2. A device that's been offline must be able to send everything it buffered,
   in one go, once it reconnects — potentially far more than 10 readings.

**The key move: the rate limit counts requests, not readings.** A device
sends its telemetry as a JSON array in a single `POST`; the rate limiter
(`src/middlewares/rateLimit.ts`) increments once per HTTP request regardless
of how many readings are in that request's body (up to the 500-item batch
cap). So a device catching up on two hours of buffered data sends **one**
request containing 15+ readings — that's 1 unit against its 10/minute
budget, not 15.

The rate limiter itself is a **sliding window counter**, keyed per device
(`rate:telemetry:{deviceId}:{window}`), not per user or per IP — so one
device misbehaving doesn't affect another device's budget. On a Redis error,
the limiter fails open (logs the error and lets the request through) rather
than blocking telemetry ingestion because a cache went down — losing rate-limit
enforcement briefly is a better failure mode than losing real device data.

Separately, each stored reading keeps both its own `timestamp` (when the
device recorded it) and `createdAt` (when the row was inserted). Alerts use
`timestamp`, not `createdAt`, as their `triggeredAt` — so a buffered reading
that crossed a threshold two hours ago produces an alert dated two hours ago,
not "just now."

---

## 4. Caching: TTL and strategy

**Strategy: cache-aside.** `GET /devices/:id/latest` checks Redis first; on a
miss, it falls back to Postgres (most recent row by `timestamp`) and
repopulates the cache. Every ingestion (`POST /devices/:id/telemetry`)
**invalidates** the cache for that device immediately, rather than trying to
write the new value directly — write-through would mean guessing which
reading in a batch is actually the "latest" one at write time, which is
exactly the kind of thing that goes wrong with buffered/out-of-order data (an
old buffered reading arriving after a live one shouldn't silently become the
cached "latest"). Invalidating and letting the next read repopulate from the
database is simpler and correct in both the ordinary and buffered case, at
the cost of one extra DB read on the next `latest` call after a write.

**TTL: 60 seconds.** This is a safety net, not the primary invalidation
mechanism — since writes invalidate immediately, the TTL only matters if a
device silently stops reporting altogether (no more writes to trigger
invalidation, but the dashboard shouldn't keep serving an increasingly stale
"latest" reading forever). 60s balances staying reasonably fresh against not
adding needless Redis traffic for a dashboard that polls every ~5s.

Both cache paths (`HIT`/`MISS`) are logged via `logger.info` in
`telemetry.cache.service.ts`.

---

## 5. Database: index choice, and the 50-million-rows question

**Index:** `telemetry(deviceId, timestamp)` (`ix_telemetry_deviceId_timestamp_idx`).
Both read paths — `latest` (most recent row for a device) and `history`
(range query by device, ordered/filtered by timestamp) — filter on
`deviceId` and sort/range on `timestamp`. A composite index on those two
columns serves both without a full table scan.

**At 50 million telemetry rows/day**, I'd keep `users`, `devices`, and
`alerts` in Postgres — they're genuinely relational (foreign keys,
uniqueness constraints, low write volume, need for transactional
consistency), and none of that changes with telemetry volume.
Telemetry itself I'd move off Postgres row storage to an analytical data warehouse like ClickHouse.
I'd also partition/retain aggressively — raw per-reading rows probably don't need to live forever,
and I'd move the old/partitioned data to an object storage like (s3).

---

## 6. What I didn't get to, and what I'd do next

**Testing** I didn't have the time to test but would test against 
bulk ingestion of telemetry data, query injection and rate limiting.

**Not deduplicated:** exact-duplicate readings (same device, same timestamp,
same values) are stored as separate rows rather than detected and skipped.
A unique constraint or upsert-on-conflict on `(deviceId, timestamp)` would
handle this, but I didn't want to silently drop a legitimate case where a
device genuinely reports twice in the same second with different sensor
noise — this needs a decision, not just a constraint.

**Batch validation is all-or-nothing:** as noted before, one bad
reading in a batch currently rejects the whole batch. A partial-acceptance
response (accept the valid readings, report which ones were rejected and
why) would be more useful for a real device client and is the next thing
I'd build.

**Not built:**
- Per-device configurable thresholds (currently
`LOW_BATTERY_THRESHOLD`/`HIGH_TEMPERATURE_THRESHOLD` are global, set once via
env vars, not overridable per device);

- Injestion pipline currently we ingest raw data from devices and store it in
the database, then we process it and store it in the database, then We do the 
same for alerts, we get alerts from the devices and store them in the database
all this in single request. I'd make it a stream processing pipeline using kafka/rabbitmq 
then have mulitple injetion workers to process the data and store it in the database.
