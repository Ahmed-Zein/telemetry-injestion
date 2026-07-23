import { Request, Response, NextFunction } from "express";
import { IJwtService } from "../services/jwt.service.js";
import { AppError } from "../utils/error.js";

export const createAuthMiddleware = (jwtService: IJwtService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(
          401,
          "Authentication failed: Token missing or malformed.",
        );
      }

      const token = authHeader.split(" ")[1];

      const decodedPayload = jwtService.verifyAccessToken(token);

      req.user = decodedPayload;

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(401, "Invalid or expired token."));
      }
    }
  };
};
