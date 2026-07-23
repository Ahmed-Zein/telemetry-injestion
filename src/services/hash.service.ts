// cypod-telemetry
import bcrypt from "bcrypt";
import { config } from "../config/index.js";

export interface IHashService {
  hash(data: string): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
}

export class BcryptService implements IHashService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = config.bcrypt.saltRounds;
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
