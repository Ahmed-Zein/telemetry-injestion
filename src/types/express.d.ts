// cypod-telemetry
import { JwtPayload } from "jsonwebtoken";
import { Device } from "../infra/db/schema.js";

export interface AppJwtPayload extends JwtPayload {
  user?: { email: string; id: number };
}

declare global {
  namespace Express {
    interface Request {
      user?: AppJwtPayload;
      device?: Device;
      deviceId?: number;
      locale?: string;
    }
  }
}

export { };
