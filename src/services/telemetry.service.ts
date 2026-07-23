// cypod-telemetry
import { Telemetry } from "../infra/db/schema.js";
import { ITelemetryRepository } from "../repositories/telemetry.repository.js";
import { BadRequestError } from "../utils/error.js";

export interface ITelemetryService {
  getAll(
    deviceId: number,
    fromDate: string,
    toDate: string,
  ): Promise<Telemetry[]>;
}
export class TelemetryService implements ITelemetryService {
  private telemetryRepository: ITelemetryRepository;
  constructor(telemetryRepository: ITelemetryRepository) {
    this.telemetryRepository = telemetryRepository;
  }
  async getAll(
    deviceId: number,
    from: string | undefined,
    to: string | undefined,
  ): Promise<Telemetry[]> {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (fromDate && isNaN(fromDate.getTime())) {
      throw new BadRequestError(`Invalid 'from' date format: ${from}`);
    }

    if (toDate && isNaN(toDate.getTime())) {
      throw new BadRequestError(`Invalid 'from' date format: ${to}`);
    }

    const result = await this.telemetryRepository.getTelemetry(
      deviceId,
      fromDate,
      toDate,
    );
    return result;
  }
}
