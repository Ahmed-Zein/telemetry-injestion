// cypod-telemetry
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppJwtPayload } from "../types/express.js";

export interface IJwtService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): AppJwtPayload;
  verifyRefreshToken(token: string): AppJwtPayload;
}

export class JwtService implements IJwtService {
  generateAccessToken(payload: AppJwtPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.accessExpiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, config.jwt.accessTokenSecret, options);
  }

  generateRefreshToken(payload: AppJwtPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, config.jwt.refreshTokenSecret, options);
  }

  verifyAccessToken(token: string): AppJwtPayload {
    return jwt.verify(token, config.jwt.accessTokenSecret) as AppJwtPayload;
  }

  verifyRefreshToken(token: string): AppJwtPayload {
    return jwt.verify(token, config.jwt.refreshTokenSecret) as AppJwtPayload;
  }
}
