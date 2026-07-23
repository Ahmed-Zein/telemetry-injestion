// cypod-telemetry
import { Router } from "express";

import alertsRouter from "./alerts.router.js";
import authRouter from "./auth.router.js";
import devicesRouter from "./devices.router.js";
const router = Router();

const apiVersion = "v1";

router
  .use(`/api/${apiVersion}/alerts`, alertsRouter)
  .use(`/api/${apiVersion}/auth`, authRouter)
  .use(`/api/${apiVersion}/devices`, devicesRouter);

export default router;
