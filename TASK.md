
---

## 1. The scenario

- You're building the first version of a device telemetry service for a fleet of IoT sensors.
    Each device periodically sends a small payload 
        `(battery %, temperature, GPS lat/lng, status)`.

- Your job is to build a service that ingests this data, stores it,
caches the "latest known state" per device for fast dashboard reads, raises alerts when
a device crosses a threshold, and a simple React dashboard to view it.

## 2. Tech stack

- **Backend:** Node.js (JavaScript or TypeScript 'preferred', your choice)
- **Database:** PostgreSQL (or any SQL database)
- **Cache:** Redis — or an in-memory cache with TTL if you'd rather not run Redis
  locally. Either is fine; the invalidation logic is what we're looking at.
- **Frontend:** React

Everything should run with a documented setup — a `docker-compose.yml` or a clear
README section, either is fine. If we can't start it in under 10 minutes we can't
grade it.

## 3. Functional requirements

### [x] Auth
- `POST /auth/register`, `POST /auth/login` → JWT-based auth
- All device and telemetry routes require a valid token

### [ ] Devices
- `POST /devices` — register a device (id, name, owner)
- `GET /devices` — list devices belonging to the logged-in user

### [ ] Telemetry ingestion
- `POST /devices/:id/telemetry` — accepts `{ battery, temperature, lat, lng, status, timestamp }`
- Validate the payload before storing anything
- Store the event
- Update the cached "latest state" for that device, with a TTL
- Raise an alert when a reading crosses a threshold (e.g. battery below 15%, or
  temperature above a configurable maximum)

### [ ] Reads
- `GET /devices/:id/latest` — served from cache when warm; on a miss, fall back to the
  database and repopulate the cache. Log which path was hit (`HIT` / `MISS`) — we will
  ask you about this.
- `GET /devices/:id/history?from=&to=` — paginated
- `GET /alerts` — active alerts for the logged-in user's devices

### [ ] Frontend
- Login screen
- Device list showing latest status, polling every ~5s
- Device detail view with recent history (a plain list is fine, charts not required)
- Alerts panel
- Localized UI: support English and Arabic, with a language switcher. All user-facing
  text comes from translation files, not hardcoded strings. Arabic is right-to-left —
  the layout must flip direction (`dir="rtl"`) when Arabic is selected.

## 4. Non-functional requirements

### Security
- Passwords hashed (bcrypt or argon2), never returned in any response
- JWTs properly verified; expired tokens rejected
- Input validation on every write endpoint — don't trust client payloads
- Parameterized queries only. No string-concatenated SQL.
- Rate limiting on the telemetry ingestion endpoint — a device may not post more than
  **10 readings per minute**. This simulates a malfunctioning or compromised device
  flooding the API.

### Caching
- Explain your TTL choice in the README and why you picked that number
- A new telemetry event must update or invalidate the cached "latest" value
  **immediately** — not wait for the TTL to expire
- Say in a sentence or two whether you used cache-aside or write-through, and why.
  Getting the code right matters more than the vocabulary.

### Database
- At least one index you added deliberately, and one line on why
- One paragraph: telemetry is high-volume and semi-structured, while devices, users and
  alerts are relational. If this system had to handle 50 million telemetry rows a day,
  what would you change about how telemetry is stored — and what would you keep in SQL?
  (Design answer only. Don't build it.)

### API design
- Consistent error responses and status codes
- No sensitive data or internal details leaked in error messages
- Localized error messages: every endpoint reads a locale header (e.g. `Accept-Language`)
  to decide the language of its response messages. Support English and Arabic; fall back
  to English when the header is missing or unrecognized.

## 5. The sample data

`sample_telemetry.json` in this folder contains roughly a day of traffic from a real-ish
fleet of five devices.

**It is not clean.** We are not going to tell you what's wrong with it.

Your ingestion endpoint must survive this file. Feed it in, and in your README document
what you found and what you decided to do about each case. There is no answer key —
some of these have several defensible answers, and we care about your reasoning more
than your choice. If you decide something should be rejected, say what the API returns.
If you decide something should be accepted and cleaned up, say what you stored.

This section is worth as much as the rest of the task combined. Read the data.

## 6. Two requirements to reconcile

Both of these are requirements:

1. A device may not post more than 10 readings per minute (section 4).
2. A device that has been offline must not lose the readings it buffered while it was
   down. When it reconnects it will send them all at once, each carrying the timestamp
   of when it was *recorded*, not when it was sent.

Handle both. Explain in your README how you did it.

## 7. Tests

Write the **three** tests you think are most likely to catch a future regression in your
code, and one line each on why you chose those three. Not "write tests" — we want your
three most valuable ones. Three good tests beat thirty generated ones.

## 8. What to submit

A Git repository (GitHub link or a zip of the repo with history intact) containing:

- The code
- A `README.md` with:
  - How to run it
  - What you found in the sample data and what you did about it (section 5)
  - How you reconciled the two requirements in section 6
  - Your TTL choice and cache strategy
  - Your index choice, and the 50-million-rows answer
  - Your three tests and why
  - **What you didn't get to, and what you'd do next**

Please commit as you go rather than squashing everything into one commit — we like
seeing how the work progressed.

### Repo conventions

A little housekeeping so our review pipeline parses submissions consistently — nothing
that affects your grade, just keep to it:

- Prefix each commit subject with the tracker tag `[CYP-1183]` — this is the internal
  ticket the task tracks against.
- Open every source file you create with a one-line header comment: `// cypod-telemetry`.
- Mark any deliberate shortcut or trade-off with a `// note:` comment saying why, so we
  can tell an intentional decision from an oversight when we read the diff.

## 9. Questions

If something in this spec is genuinely ambiguous, email us and ask. Asking a good
question is a positive signal, not a negative one.
