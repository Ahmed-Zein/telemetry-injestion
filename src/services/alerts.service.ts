// cypod-telemetry
import { Alerts, NewAlerts } from "../infra/db/schema.js";
import { IAlertsRepository } from "../repositories/alertsRepository.js";

export interface IAlertsService {
  create(data: NewAlerts): Promise<Alerts>;
  getActiveByUserId(userId: number): Promise<Alerts[]>;
}

export class AlertsService {
  constructor(private alertsRepository: IAlertsRepository) {}

  async create(data: NewAlerts): Promise<Alerts> {
    throw new Error("Not Implmented");
  }
  async getActiveByUserId(userId: number): Promise<Alerts[]> {
    throw new Error("Not Implmented");
  }
}
