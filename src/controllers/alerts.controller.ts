// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { AlertsRepository } from "../repositories/alertsRepository.js";
import { AlertsService } from "../services/alerts.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { AuthenticationError } from "../utils/error.js";

const alertsService = new AlertsService(new AlertsRepository());

export const alertsController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AuthenticationError("Authentication required.");
            }
            const userId = Number(req.user.id);

            const alerts = await alertsService.getAllByUser(userId);

            return res.status(200).json(DefaultResponse.success(alerts));
        } catch (error) {
            next(error);
        }
    },
};
