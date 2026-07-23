// cypod-telemetry
import { alertThresholds } from "../config/alertTrhresholds.js";
import { TelemetryCreateRequest } from "../dtos/telemety.dto.js";
import { Telemetry } from "../infra/db/schema.js";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { ITelemetryRepository } from "../repositories/telemetry.repository.js";
import { BadRequestError } from "../utils/error.js";
import { logger } from "../utils/logger.js";
import { IAlertsService } from "./alerts.service.js";

export interface ITelemetryService {
  getAll(
    deviceId: number,
    fromDate: string,
    toDate: string,
  ): Promise<Telemetry[]>;
  create(deviceId: number, data: TelemetryCreateRequest): Promise<Telemetry>;
}

export class TelemetryService implements ITelemetryService {
  constructor(
    private telemetryRepository: ITelemetryRepository,
    private devicesRepository: IDevicesRepository,
    private alertsService: IAlertsService,
  ) {}
  async create(
    deviceId: number,
    data: TelemetryCreateRequest,
  ): Promise<Telemetry> {
    const stored = await this.telemetryRepository.create({
      deviceId,
      battery: data.battery,
      temperature: data.temperature,
      lat: data.lat,
      lng: data.lng,
      status: data.status,
      timestamp: new Date(data.timestamp),
    });
    if (data.battery < alertThresholds.lowBatteryPercent) {
      logger.info("BATTARY ALERT");
    }
    if (data.temperature > alertThresholds.highTemperatureCelsius) {
      logger.info("TEMPRATURE ALERT");
    }
    return stored;
  }

  private validateDate(value: string | undefined, label: "from" | "to"): Date | undefined {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestError(`Invalid '${label}' date format: ${value}`);
    }

    const year = date.getFullYear();
    if (year < 2000 || year > 2100) {
      throw new BadRequestError(`'${label}' date is out of reasonable range: ${value}`);
    }

    return date;
  }

  async getAll(
    deviceId: number,
    from: string | undefined,
    to: string | undefined,
  ): Promise<Telemetry[]> {
    const fromDate = this.validateDate(from, "from");
    const toDate = this.validateDate(to, "to");

    const result = await this.telemetryRepository.getTelemetry(
      deviceId,
      fromDate,
      toDate,
    );
    return result;
  }
}
