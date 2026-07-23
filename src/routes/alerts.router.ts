// cypod-telemetry

import express from "express";
import { alertsController } from "../controllers/alerts.controller.js";
import { createAuthMiddleware } from "../middlewares/auth.js";
import { JwtService } from "../services/jwt.service.js";

const router = express.Router();

router.get("/", createAuthMiddleware(new JwtService()), alertsController.getAll);

export default router;
