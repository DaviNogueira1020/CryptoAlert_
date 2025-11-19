import { AlertsRepository } from "../repositories/alerts.repository";
import { CreateAlertDTO, UpdateAlertDTO } from "../types/AlertDTO";

export class AlertsService {
  private repo = new AlertsRepository();

  async create(data: CreateAlertDTO) {
    // Validate inputs
    if (!data.crypto || !data.targetPrice || !data.direction) {
      throw {
        status: 400,
        message: "Missing required fields: crypto, targetPrice, direction",
        code: "MISSING_FIELDS",
      };
    }

    if (!["above", "below"].includes(data.direction)) {
      throw {
        status: 400,
        message: 'Direction must be "above" or "below"',
        code: "INVALID_DIRECTION",
      };
    }

    return this.repo.create(data);
  }

  async findAll(userId?: number) {
    return this.repo.findAll(userId);
  }

  async findById(id: string) {
    const alert = await this.repo.findById(id);
    if (!alert) {
      throw {
        status: 404,
        message: "Alert not found",
        code: "NOT_FOUND",
      };
    }
    return alert;
  }

  async update(id: string, data: UpdateAlertDTO) {
    await this.findById(id); // Verify exists
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id); // Verify exists
    return this.repo.delete(id);
  }
}
