// cypod-telemetry
import express from "express";
import { devicesController } from "../controllers/devices.controller.js";
import { telemetryController } from "../controllers/telemetry.controller.js";
import { createDeviceSchema } from "../dtos/device.dto.js";
import { telemetryHistoryQuerySchema } from "../dtos/telemetry.query.dto.js";
import { telemetrySchema } from "../dtos/telemety.dto.js";
import { createAuthMiddleware } from "../middlewares/auth.js";
import { checkDeviceOwnership } from "../middlewares/deviceAuth.js";
import { validateId } from "../middlewares/validateId.js";
import { validate } from "../middlewares/validate.js";
import { validateQuery } from "../middlewares/validateQuery.js";
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
  .post("/", validate(createDeviceSchema), devicesController.create);

router.get("/:id/history", validateId, deviceOwnership, validateQuery(telemetryHistoryQuerySchema), telemetryController.getAll)
  .get("/:id/latest", validateId, deviceOwnership, telemetryController.latest);

export default router;
