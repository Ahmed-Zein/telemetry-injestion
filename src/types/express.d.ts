import { AuthPayload } from "./types.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}
