// cypod-telemetry
import { and, count, desc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { NewTelemetry, Telemetry, telemetryTable } from "../infra/db/schema.js";

export interface ITelemetryInsertResult {
  inserted: Telemetry[];
  duplicates: number;
}

export interface ITelemetryRepository {
  getTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
    limit: number,
    offset: number,
  ): Promise<Telemetry[]>;
  countTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<number>;
  createMany(data: NewTelemetry[]): Promise<ITelemetryInsertResult>;
  getLatest(deviceId: number): Promise<Telemetry>;
}

export class TelemetryRepository implements ITelemetryRepository {
  private get db() {
    return getDb();
  }

  async getLatest(deviceId: number): Promise<Telemetry> {
    const results = await this.db
      .select()
      .from(telemetryTable)
      .where(eq(telemetryTable.deviceId, deviceId))
      .orderBy(desc(telemetryTable.timestamp))
      .limit(1);
    return results[0];
  }

  async createMany(data: NewTelemetry[]): Promise<ITelemetryInsertResult> {
    if (data.length === 0) return { inserted: [], duplicates: 0 };

    const inserted = await this.db
      .insert(telemetryTable)
      .values(data)
      // note: device sedning same telemetry device twice is ignore, first one is taken.
      .onConflictDoNothing({
        target: [telemetryTable.deviceId, telemetryTable.timestamp],
      })
      .returning();

    return { inserted, duplicates: data.length - inserted.length };
  }

  public async getTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
    limit: number,
    offset: number,
  ): Promise<Telemetry[]> {
    const conditions = [eq(telemetryTable.deviceId, deviceId)];

    if (fromDate) conditions.push(gte(telemetryTable.timestamp, fromDate));
    if (toDate) conditions.push(lte(telemetryTable.timestamp, toDate));

    const result = await this.db
      .select()
      .from(telemetryTable)
      .where(and(...conditions))
      .orderBy(desc(telemetryTable.timestamp))
      .limit(limit)
      .offset(offset);

    return result;
  }

  async countTelemetry(
    deviceId: number,
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<number> {
    const conditions = [eq(telemetryTable.deviceId, deviceId)];

    if (fromDate) conditions.push(gte(telemetryTable.timestamp, fromDate));
    if (toDate) conditions.push(lte(telemetryTable.timestamp, toDate));

    const [result] = await this.db
      .select({ count: count() })
      .from(telemetryTable)
      .where(and(...conditions));

    return Number(result.count);
  }
}
