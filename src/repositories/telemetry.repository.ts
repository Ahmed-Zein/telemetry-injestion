// cypod-telemetry
import { and, desc, eq, gte, lte, or } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { alertsTable, Telemetry, telemetryTable } from "../infra/db/schema.js";
import { from } from "stream/iter";

export interface ITelemetryRepository {
  getTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<Telemetry[]>;
}

export class TelemetryRepository implements ITelemetryRepository {
  private get db() {
    return getDb();
  }

  public async getTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<Telemetry[]> {
    const conditions = [eq(telemetryTable.deviceId, deviceId)];

    if (fromDate) conditions.push(gte(telemetryTable.timestamp, fromDate));
    if (toDate) conditions.push(lte(telemetryTable.timestamp, toDate));

    const result = await this.db
      .select()
      .from(telemetryTable)
      .where(and(...conditions))
      .orderBy(desc(telemetryTable.timestamp));

    return result;
  }
}
