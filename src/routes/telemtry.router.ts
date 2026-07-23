// cypod-telemetry
import express from "express";
import { telemetryController } from "../controllers/telemetry.controller.js";
import { telemetrySchema } from "../dtos/telemety.dto.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
    "/",
    validate(telemetrySchema),
    telemetryController.create,
);

export default router;
