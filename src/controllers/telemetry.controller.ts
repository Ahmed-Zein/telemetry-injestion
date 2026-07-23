// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { AlertsRepository } from "../repositories/alertsRepository.js";
import { DevicesRepository } from "../repositories/devices.repository.js";
import { TelemetryRepository } from "../repositories/telemetry.repository.js";
import { AlertsService } from "../services/alerts.service.js";
import { telemetryCache } from "../services/telemetry.cache.service.js";
import { TelemetryService } from "../services/telemetry.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { AuthenticationError, BadRequestError } from "../utils/error.js";

const telemetryRepository = new TelemetryRepository();
const devicesRepository = new DevicesRepository();
const alertsRepository = new AlertsRepository();

const alertsService = new AlertsService(alertsRepository);

const telemetryService = new TelemetryService(
  telemetryRepository,
  devicesRepository,
  alertsService,
  telemetryCache,
);

export const telemetryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required.");
      }
      const deviceId = Number(req.params.id);
      if (isNaN(deviceId)) {
        throw new BadRequestError("wrong device id");
      }

      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;

      const result = await telemetryService.getAll(deviceId, from, to);

      return res.status(200).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AuthenticationError("Authentication required.");

      const deviceId = Number(req.params.id);
      if (isNaN(deviceId)) throw new BadRequestError("Invalid device id");

      const result = await telemetryService.create(deviceId, req.body);
      return res.status(201).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async latest(req: Request, res: Response, next: NextFunction) {
    const deviceId = Number(req.params.id);
    if (isNaN(deviceId)) throw new BadRequestError("Invalid device id");
    const cacheTel = await telemetryCache.get(deviceId);
    if (cacheTel !== undefined) {
      return res.status(200).json(DefaultResponse.success(cacheTel));
    }

    const latestState = await telemetryService.getLatest(deviceId);
    if (latestState) {
      await telemetryCache.set(deviceId, latestState);
    }

    return res.status(200).json(DefaultResponse.success(latestState));
  },
};

