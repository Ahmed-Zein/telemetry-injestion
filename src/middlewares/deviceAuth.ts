// cypod-telemetry
import { RequestHandler } from "express";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { NotFoundError, BadRequestError } from "../utils/error.js";

export const checkDeviceOwnership = (
  devicesRepository: IDevicesRepository,
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const deviceId = Number(req.params.id);

      if (isNaN(deviceId)) {
        throw new BadRequestError("wrong device id");
      }

      const device = await devicesRepository.findById(deviceId);

      if (!device) {
        return next(new NotFoundError("Device not found"));
      }

      if (device.ownerId !== req.user?.id) {
        return next(new NotFoundError("Device not found"));
      }

      req.device = device;
      next();
    } catch (error) {
      next(error);
    }
  };
};
