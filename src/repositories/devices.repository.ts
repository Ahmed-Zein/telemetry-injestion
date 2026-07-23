import { and, eq } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { Device, devicesTable, NewDevice } from "../infra/db/schema.js";

export interface IDevicesRepository {
  findAllByUserId(userId: number): Promise<Device[]>;
  create(data: NewDevice): Promise<Device>;
  nameExists(name: string, userId: number): Promise<boolean>;
}

export class DevicesRepository implements IDevicesRepository {
  private get db() {
    return getDb();
  }

  async findAllByUserId(userId: number): Promise<Device[]> {
    const result = await this.db
      .select()
      .from(devicesTable)
      .where(eq(devicesTable.userId, userId));

    return result ?? [];
  }

  async create(data: NewDevice): Promise<Device> {
    const results = await this.db.insert(devicesTable).values(data).returning();
    return results[0];
  }
  async nameExists(name: string, userId: number): Promise<boolean> {
    const results = await this.db
      .select({ id: devicesTable.id })
      .from(devicesTable)
      .where(and(eq(devicesTable.userId, userId), eq(devicesTable.name, name)))
      .limit(1);

    return results.length > 0;
  }
}
