// cypod-telemetry
import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service.js";
import { BcryptService } from "../services/hash.service.js";
import { JwtService } from "../services/jwt.service.js";
import { DefaultResponse } from "../utils/default.response.js";
import { UserRepository } from "../repositories/user.repository.js";

const userService = new UserService(
  new UserRepository(),
  new BcryptService(),
  new JwtService(),
);

export const userController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const authReponse = await userService.registerUser(userData);
    if (!authReponse) {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(200).json(DefaultResponse.success(authReponse));
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const authReponse = await userService.loginUser(req.body);
    if (!authReponse) {
      return res.status(401).json(DefaultResponse.fail("Invalid credentials"));
    }
    res.status(200).json(DefaultResponse.success(authReponse));
  },
};
