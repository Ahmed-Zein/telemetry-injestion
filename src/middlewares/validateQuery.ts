// cypod-telemetry
import type { RequestHandler } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/error.js";

export const validateQuery =
  (schema: z.ZodType): RequestHandler =>
    (req, res, next) => {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errorMessage = result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        return next(new BadRequestError("error.validation_failed", { details: errorMessage }));
      }

      req.query = result.data as any;
      next();
    };
