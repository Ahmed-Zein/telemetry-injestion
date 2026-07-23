// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { NewTelemetry } from "../infra/db/schema.js";
import { AlertsRepository } from "../repositories/alertsRepository.js";
import { DevicesRepository } from "../repositories/devices.repository.js";
import { TelemetryRepository } from "../repositories/telemetry.repository.js";
import { AlertsService } from "../services/alerts.service.js";
import { telemetryCache } from "../services/telemetry.cache.service.js";
import { TelemetryService } from "../services/telemetry.service.js";
import { DefaultResponse } from "../utils/default.response.js";

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
// note: device ownership and validation handled by checkDeviceOwnership middleware
export const telemetryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceId = Number(req.params.id);
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

      const result = await telemetryService.getAll(deviceId, from, to, page, limit);

      return res.status(200).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceId = Number(req.params.id);
      const items: NewTelemetry[] = Array.isArray(req.body)
        ? req.body
        : [req.body];
      const result = await telemetryService.createMany(deviceId, items);

      return res.status(201).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async latest(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceId = Number(req.params.id);
      const cacheTel = await telemetryCache.get(deviceId);
      if (cacheTel !== undefined) {
        return res.status(200).json(DefaultResponse.success(cacheTel));
      }

      const latestState = await telemetryService.getLatest(deviceId);
      if (latestState) {
        await telemetryCache.set(deviceId, latestState);
      }

      return res.status(200).json(DefaultResponse.success(latestState));
    } catch (error) {
      next(error);
    }
  },
};
