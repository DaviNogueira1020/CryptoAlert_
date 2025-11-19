import { Request, Response } from "express";
import { AlertsService } from "../services/alerts.service";

const service = new AlertsService();

export class AlertsController {
  async create(req: Request, res: Response) {
    try {
      const { userId, crypto, targetPrice, direction } = req.body;

      const newAlert = await service.create({
        userId: Number(userId),
        crypto,
        targetPrice: Number(targetPrice),
        direction,
      });

      return res.status(201).json(newAlert);
    } catch (err: any) {
      return res.status(err.status || 500).json({
        error: err.message || "Internal server error",
        code: err.code || "INTERNAL_ERROR",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const alerts = await service.findAll(userId);
      return res.json(alerts);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch alerts" });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const alert = await service.findById(req.params.id);
      return res.json(alert);
    } catch (err: any) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await service.update(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await service.delete(req.params.id);
      return res.json({ message: "Alert deleted successfully", data: deleted });
    } catch (err: any) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}
