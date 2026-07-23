// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service.js";
import { BcryptService } from "../services/hash.service.js";
import { JwtService } from "../services/jwt.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { UserRepository } from "../repositories/user.repository.js";
import { ConflictError, AuthenticationError } from "../utils/error.js";
import { t, DEFAULT_LOCALE } from "../i18n/index.js";

const userService = new UserService(
  new UserRepository(),
  new BcryptService(),
  new JwtService(),
);

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const locale = req.locale || DEFAULT_LOCALE;
      const authReponse = await userService.registerUser(userData);
      if (!authReponse) {
        throw new ConflictError("user.already_exists");
      }
      res.status(200).json(DefaultResponse.success(authReponse, t("success.default", locale)));
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locale = req.locale || DEFAULT_LOCALE;
      const authReponse = await userService.loginUser(req.body);
      if (!authReponse) {
        throw new AuthenticationError("user.invalid_credentials");
      }
      res.status(200).json(DefaultResponse.success(authReponse, t("success.default", locale)));
    } catch (error) {
      next(error);
    }
  },
};
