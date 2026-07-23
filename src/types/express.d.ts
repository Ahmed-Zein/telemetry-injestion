// cypod-telemetry
import { JwtPayload } from "jsonwebtoken";

export interface AppJwtPayload extends JwtPayload {
  user?: { email: string; id: number };
}

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
    }
  }
}

export {};
