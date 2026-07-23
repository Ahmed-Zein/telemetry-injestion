import { NextFunction, Request, Response } from "express";
import { TelemetryRepository } from "../repositories/telemetry.repository.js";
import { TelemetryService } from "../services/telemetry.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { AuthenticationError, BadRequestError } from "../utils/error.js";

const telemetryRepository = new TelemetryRepository();
const telemetryService = new TelemetryService(telemetryRepository);

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

  async create(req: Request, res: Response, next: NextFunction) {},
};
