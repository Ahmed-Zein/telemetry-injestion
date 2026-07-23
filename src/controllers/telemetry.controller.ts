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
      const { from, to, page, limit } = req.query as unknown as {
        from?: string;
        to?: string;
        page: number;
        limit: number;
      };

      const result = await telemetryService.getAll(req.deviceId!, from, to, page, limit);

      return res.status(200).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const items: NewTelemetry[] = Array.isArray(req.body)
        ? req.body
        : [req.body];
      await telemetryService.createMany(req.deviceId!, items);

      return res.status(201).end();
    } catch (error) {
      next(error);
    }
  },

  async latest(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceId = req.deviceId!;
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
