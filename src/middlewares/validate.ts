// cypod-telemetry
import type { RequestHandler } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/error.js";

export const validate =
  (schema: z.ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      return next(new BadRequestError(errorMessage));
    }

    req.body = result.data;
    next();
  };
