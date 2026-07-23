// cypod-telemetry
import { alertThresholds } from "../config/alertTrhresholds.js";
import { TelemetryCreateRequest } from "../dtos/telemety.dto.js";
import { Telemetry } from "../infra/db/schema.js";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { ITelemetryRepository } from "../repositories/telemetry.repository.js";
import { AlertTypes } from "../utils/alertytypes.js";
import { BadRequestError } from "../utils/error.js";
import { IAlertsService } from "./alerts.service.js";

export interface ITelemetryService {
  getAll(
    deviceId: number,
    fromDate: string,
    toDate: string,
  ): Promise<Telemetry[]>;
  create(deviceId: number, data: TelemetryCreateRequest): Promise<Telemetry>;
  getLatest(deviceId: number): Promise<Telemetry>;
}

export class TelemetryService implements ITelemetryService {
  constructor(
    private telemetryRepository: ITelemetryRepository,
    private devicesRepository: IDevicesRepository,
    private alertsService: IAlertsService,
  ) { }

  async getLatest(deviceId: number): Promise<Telemetry> {
    return this.telemetryRepository.getLatest(deviceId);
  }

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
      await this.alertsService.create({
        deviceId: deviceId,
        type: AlertTypes.LOW_BATTERY,
        message: `Device Battery is low ${stored.battery} < ${alertThresholds.lowBatteryPercent}`,
        triggerValue: stored.battery,
        thresholdValue: alertThresholds.lowBatteryPercent,
        triggeredAt: new Date(data.timestamp),
      })
    }

    if (data.temperature > alertThresholds.highTemperatureCelsius) {
      await this.alertsService.create({
        deviceId: deviceId,
        type: AlertTypes.HIGH_TEMPERATURE,
        message: `Device Tempreture is High ${stored.temperature} > ${alertThresholds.highTemperatureCelsius}`,
        triggerValue: stored.temperature,
        thresholdValue: alertThresholds.highTemperatureCelsius,
        triggeredAt: new Date(data.timestamp),
      })
    }
    return stored;
  }

  private validateDate(
    value: string | undefined,
    label: "from" | "to",
  ): Date | undefined {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestError(`Invalid '${label}' date format: ${value}`);
    }

    const year = date.getFullYear();
    if (year < 2000 || year > 2100) {
      throw new BadRequestError(
        `'${label}' date is out of reasonable range: ${value}`,
      );
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
