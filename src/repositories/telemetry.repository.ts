// cypod-telemetry
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { NewTelemetry, Telemetry, telemetryTable } from "../infra/db/schema.js";

export interface ITelemetryRepository {
  getTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<Telemetry[]>;
  create(data: NewTelemetry): Promise<Telemetry>;
}

export class TelemetryRepository implements ITelemetryRepository {
  private get db() {
    return getDb();
  }

  async create(data: NewTelemetry): Promise<Telemetry> {
    const result = await this.db
      .insert(telemetryTable)
      .values(data)
      .returning();
    return result[0];
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
