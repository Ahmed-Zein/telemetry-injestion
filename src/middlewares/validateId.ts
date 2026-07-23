// cypod-telemetry
import { RequestHandler } from "express";
import { BadRequestError } from "../utils/error.js";

export const validateId: RequestHandler = (req, res, next) => {
  const id = Number(req.params.id);
  if (isNaN(id) || !Number.isInteger(id)) {
    return next(new BadRequestError("device.invalid_id"));
  }
  req.deviceId = id;
  next();
};
