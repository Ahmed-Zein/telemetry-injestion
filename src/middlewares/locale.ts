// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { resolveLocale } from "../i18n/index.js";

export const localeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  req.locale = resolveLocale(req);
  next();
};
