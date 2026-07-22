import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const VERY_SECURE_TOKEN = "VERY_SECURE_TOKEN";
const VERY_SECURE_TOKEN_REFRESH = "VERY_SECURE_TOKEN_REFRESH";

export interface IJwtService {
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
  verifyAccessToken(token: string): JwtPayload | string;
  verifyRefreshToken(token: string): JwtPayload | string;
}

export class JwtService implements IJwtService {
  generateAccessToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: "7d",
    };
    return jwt.sign(payload, VERY_SECURE_TOKEN, options);
  }

  generateRefreshToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: "30d",
    };
    return jwt.sign(payload, VERY_SECURE_TOKEN_REFRESH, options);
  }

  verifyAccessToken(token: string): JwtPayload | string {
    return jwt.verify(token, VERY_SECURE_TOKEN);
  }

  verifyRefreshToken(token: string): JwtPayload | string {
    return jwt.verify(token, VERY_SECURE_TOKEN_REFRESH);
  }
}
