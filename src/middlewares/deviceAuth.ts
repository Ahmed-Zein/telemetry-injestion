// cypod-telemetry
import { RequestHandler } from "express";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { NotFoundError } from "../utils/error.js";

export const checkDeviceOwnership = (
  devicesRepository: IDevicesRepository,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const deviceId = Number(req.params.id);
      const device = await devicesRepository.findById(deviceId);

      if (!device) {
        return next(new NotFoundError("device.not_found"));
      }

      if (device.ownerId !== req.user?.id) {
        return next(new NotFoundError("device.not_found"));
      }

      req.device = device;
      next();
    } catch (error) {
      next(error);
    }
  };
};
