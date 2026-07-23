// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import { AlertsRepository } from "../repositories/alertsRepository.js";
import { AlertsService } from "../services/alerts.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { t, DEFAULT_LOCALE } from "../i18n/index.js";

const alertsService = new AlertsService(new AlertsRepository());

export const alertsController = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user!.id);
            const locale = req.locale || DEFAULT_LOCALE;
            const alerts = await alertsService.getAllByUser(userId);
            return res.status(200).json(DefaultResponse.success(alerts, t("success.default", locale)));
        } catch (error) {
            next(error);
        }
    },
};
