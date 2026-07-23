// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { NewDevice } from "../infra/db/schema.js";
import { DevicesRepository } from "../repositories/devices.repository.js";
import { DevicesService } from "../services/devices.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { AuthenticationError } from "../utils/error.js";

const devicesRepository = new DevicesRepository();
const devicesService = new DevicesService(devicesRepository);

export const devicesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required.");
      }
      const result = await devicesService.getAll(req.user.id);
      return res.status(200).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required.");
      }
      const { name } = req.body;

      const data: NewDevice = {
        name,
        userId: Number(req.user.id),
      };

      const result = await devicesService.create(data);

      return res.status(201).json(DefaultResponse.success(result));
    } catch (error) {
      next(error);
    }
  },
};
