// cypod-telemetry
import { getDb } from "../infra/db/db.context.js";

export interface ITelemetryRepository {}

export class TelemetryRepository implements ITelemetryRepository {
  private get db() {
    return getDb();
  }
}
