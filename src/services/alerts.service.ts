// cypod-telemetry
import { Alert, NewAlert } from "../infra/db/schema.js";
import { IAlertsRepository } from "../repositories/alertsRepository.js";

export interface IAlertsService {
  create(data: NewAlert): Promise<Alert>;
  getAllByUser(userId: number): Promise<Alert[]>;
}

// note: we still need cross tenant(user) checking
export class AlertsService {
  constructor(private alertsRepository: IAlertsRepository) { }

  async create(data: NewAlert): Promise<Alert> {
    return await this.alertsRepository.create(data);
  }

  async getAllByUser(userId: number): Promise<Alert[]> {
    return await this.alertsRepository.getAllByUser(userId);
  }
}
