import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { Alert, alertsTable, devicesTable, NewAlert } from "../infra/db/schema.js";

// cypod-telemetry
export interface IAlertsRepository {
  create(alert: NewAlert): Promise<Alert>;
  getAllByUser(userId: number): Promise<Alert[]>;
}

export class AlertsRepository implements IAlertsRepository {
  private get db() {
    return getDb();
  }

  async create(alert: NewAlert): Promise<Alert> {
    const results = await this.db.insert(alertsTable).values(alert).returning();

    return results[0];
  }

  async getAllByUser(userId: number): Promise<Alert[]> {
    const results = await this.db
      .select({
        id: alertsTable.id,
        deviceId: alertsTable.deviceId,
        telemetryId: alertsTable.telemetryId,
        type: alertsTable.type,
        message: alertsTable.message,
        triggerValue: alertsTable.triggerValue,
        thresholdValue: alertsTable.thresholdValue,
        triggeredAt: alertsTable.triggeredAt,
        active: alertsTable.active,
        createdAt: alertsTable.createdAt,
        name: devicesTable.name,
      })
      .from(alertsTable)
      .innerJoin(devicesTable, eq(alertsTable.deviceId, devicesTable.id))
      .where(and(eq(devicesTable.ownerId, userId), eq(alertsTable.active, true)))
      .orderBy(desc(alertsTable.createdAt));

    return results;
  }
}
