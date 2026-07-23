// cypod-telemetry
import { alertThresholds } from "../config/alertTrhresholds.js";
import { telemetryConfig } from "../config/telemetry.config.js";
import { NewTelemetry, Telemetry } from "../infra/db/schema.js";
import { IDevicesRepository } from "../repositories/devices.repository.js";
import { ITelemetryRepository } from "../repositories/telemetry.repository.js";
import { AlertTypes } from "../utils/alertytypes.js";
import { BadRequestError, NotFoundError } from "../utils/error.js";
import { PaginatedResult } from "../utils/paginated.response.js";
import { IAlertsService } from "./alerts.service.js";
import { ITelemetryCache } from "./telemetry.cache.service.js";

export interface ITelemetryService {
  getAll(
    deviceId: number,
    fromDate: string | undefined,
    toDate: string | undefined,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Telemetry>>;
  createMany(
    deviceId: number,
    data: NewTelemetry[],
  ): Promise<Telemetry[]>;
  getLatest(deviceId: number): Promise<Telemetry>;
}

export class TelemetryService implements ITelemetryService {
  constructor(
    private telemetryRepository: ITelemetryRepository,
    private devicesRepository: IDevicesRepository,
    private alertsService: IAlertsService,
    private telemetryCache?: ITelemetryCache,
  ) { }

  async getLatest(deviceId: number): Promise<Telemetry> {
    return this.telemetryRepository.getLatest(deviceId);
  }

  async createMany(deviceId: number, data: NewTelemetry[]): Promise<Telemetry[]> {
    if (!data || data.length === 0) {
      throw new BadRequestError("telemetry.empty_payload");
    }

    const now = new Date();
    const maxAgeMs = telemetryConfig.maxTimestampAgeDays * 24 * 60 * 60 * 1000;
    const clockToleranceMs = 5 * 60 * 1000;

    const rowsToInsert = data.map((item) => {
      const ts = new Date(item.timestamp);
      let isValid = true;

      if (
        item.temperature < telemetryConfig.minTemperature ||
        item.temperature > telemetryConfig.maxTemperature
      ) {
        isValid = false;
      }

      if (ts.getTime() > now.getTime() + clockToleranceMs || now.getTime() - ts.getTime() > maxAgeMs) {
        isValid = false;
      }

      return {
        deviceId,
        battery: item.battery,
        temperature: item.temperature,
        lat: item.lat,
        lng: item.lng,
        status: item.status,
        timestamp: ts,
        isValid,
      };
    });

    let savedTelemetry: Telemetry[];
    try {
      savedTelemetry = await this.telemetryRepository.createMany(rowsToInsert);
    } catch (error) {
      // Postgres FK violation (23503) means deviceId doesn't exist
      if (error instanceof Error && (error as any).code === "23503") {
        throw new NotFoundError("device.not_found");
      }
      throw error;
    }

    const tasks = [];

    for (const stored of savedTelemetry) {
      if (!stored.isValid) continue;

      if (stored.battery < alertThresholds.lowBatteryPercent) {
        tasks.push(
          this.alertsService.create({
            deviceId,
            telemetryId: stored.id,
            type: AlertTypes.LOW_BATTERY,
            message: `Device battery low: ${stored.battery} < ${alertThresholds.lowBatteryPercent}`,
            triggerValue: stored.battery,
            thresholdValue: alertThresholds.lowBatteryPercent,
            triggeredAt: stored.timestamp,
          }),
        );
      }

      if (stored.temperature > alertThresholds.highTemperatureCelsius) {
        tasks.push(
          this.alertsService.create({
            deviceId,
            telemetryId: stored.id,
            type: AlertTypes.HIGH_TEMPERATURE,
            message: `Device temperature high: ${stored.temperature} > ${alertThresholds.highTemperatureCelsius}`,
            triggerValue: stored.temperature,
            thresholdValue: alertThresholds.highTemperatureCelsius,
            triggeredAt: stored.timestamp,
          }),
        );
      }
    }

    tasks.push(this.telemetryCache?.invalidate(deviceId));

    await Promise.all(tasks);

    return savedTelemetry;
  }

  private validateDate(
    value: string | undefined,
    label: "from" | "to",
  ): Date | undefined {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestError("telemetry.invalid_date", { label, value });
    }

    const year = date.getFullYear();
    if (year < 2000 || year > 2100) {
      throw new BadRequestError("telemetry.date_out_of_range", { label, value });
    }

    return date;
  }

  async getAll(
    deviceId: number,
    from: string | undefined,
    to: string | undefined,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Telemetry>> {
    const fromDate = this.validateDate(from, "from");
    const toDate = this.validateDate(to, "to");

    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.telemetryRepository.getTelemetry(deviceId, fromDate, toDate, limit, offset),
      this.telemetryRepository.countTelemetry(deviceId, fromDate, toDate),
    ]);

    const totalPages = Math.ceil(total / limit);

    return new PaginatedResult(data, totalPages, page, limit);
  }
}
