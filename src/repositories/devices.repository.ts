import { eq } from "drizzle-orm";
import { getDb } from "../infra/db/db.context.js";
import { Device, devicesTable } from "../infra/db/schema.js";

export interface IDevicesRepository {
  findAllByUserId(userId: number): Promise<Device[]>;
  create(data: Device): Promise<Device>;
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

    return result;
  }
  create(data: Device): Promise<Device> {
    throw new Error("Method not implemented.");
  }
}
