// cypod-telemetry
import { Router } from "express";

import alertsRouter from "./alerts.router.js";
import authRouter from "./auth.router.js";
import devicesRouter from "./devices.router.js";
import telemetryRouter from "./telemtry.router.js";

const router = Router();

const apiVersion = "v1";

router
  .use(`/api/${apiVersion}/alerts`, alertsRouter)
  .use(`/api/${apiVersion}/auth`, authRouter)
  .use(`/api/${apiVersion}/devices`, devicesRouter)
  .use("/devices", telemetryRouter); // note: I explicitly made the telmetry without /api/v* in case there is extenal tool use it for verification.

export default router;
