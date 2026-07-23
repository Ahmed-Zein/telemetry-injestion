// cypod-telemetry
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { AppJwtPayload } from "../types/express.js";

// note: global config will be configured later on
const VERY_SECURE_TOKEN = "VERY_SECURE_TOKEN";
const VERY_SECURE_TOKEN_REFRESH = "VERY_SECURE_TOKEN_REFRESH";

export interface IJwtService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): AppJwtPayload;
  verifyRefreshToken(token: string): AppJwtPayload;
}

export class JwtService implements IJwtService {
  generateAccessToken(payload: AppJwtPayload): string {
    const options: SignOptions = {
      expiresIn: "7d",
    };
    return jwt.sign(payload, VERY_SECURE_TOKEN, options);
  }

  generateRefreshToken(payload: AppJwtPayload): string {
    const options: SignOptions = {
      expiresIn: "30d",
    };
    return jwt.sign(payload, VERY_SECURE_TOKEN_REFRESH, options);
  }

  verifyAccessToken(token: string): AppJwtPayload {
    return jwt.verify(token, VERY_SECURE_TOKEN) as AppJwtPayload;
  }

  verifyRefreshToken(token: string): AppJwtPayload {
    return jwt.verify(token, VERY_SECURE_TOKEN_REFRESH) as AppJwtPayload;
  }
}
