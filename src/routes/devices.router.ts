// cypod-telemetry
import express from "express";
import { devicesController } from "../controllers/devices.controller.js";
import { telemetryController } from "../controllers/telemetry.controller.js";
import { telemetrySchema } from "../dtos/telemety.dto.js";
import { createAuthMiddleware } from "../middlewares/auth.js";
import { checkDeviceOwnership } from "../middlewares/deviceAuth.js";
import { validate } from "../middlewares/validate.js";
import { DevicesRepository } from "../repositories/devices.repository.js";
import { JwtService } from "../services/jwt.service.js";

const router = express.Router();

const jwtService = new JwtService();
const authMiddleware = createAuthMiddleware(jwtService);
const devicesRepository = new DevicesRepository();
const deviceOwnership = checkDeviceOwnership(devicesRepository);

// All device and telemetry routes require a valid token
router.use(authMiddleware);

router.get("/", devicesController.getAll)
  .post("/", devicesController.create);

router.get("/:id/history", deviceOwnership, telemetryController.getAll)
  .get("/:id/latest", deviceOwnership, telemetryController.latest);

router.post(
  "/:id/telemetry",
  deviceOwnership,
  validate(telemetrySchema),
  telemetryController.create,
);

export default router;
