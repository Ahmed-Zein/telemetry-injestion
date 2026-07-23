// cypod-telemetry
import { Device, NewDevice } from "../infra/db/schema.js";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { ConflictError } from "../utils/error.js";

export interface IDevicesService {
  getAll(userId: number): Promise<Device[]>;
  create(data: Device): Promise<Device>;
}

export class DevicesService implements IDevicesService {
  private devicesRepository: IDevicesRepository;

  constructor(devicesRepository: IDevicesRepository) {
    this.devicesRepository = devicesRepository;
  }

  async create(data: NewDevice): Promise<Device> {
    if (await this.devicesRepository.nameExists(data.name, data.ownerId)) {
      throw new ConflictError("device.name_exists");
    }
    const device = await this.devicesRepository.create(data);
    return device;
  }

  async getAll(userId: number): Promise<Device[]> {
    const result = await this.devicesRepository.findAllByUserId(userId);
    return result;
  }
}
