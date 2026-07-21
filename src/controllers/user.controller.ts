import { NextFunction, Request, Response } from "express";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";

export const userController = {
  register: (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const userService = new UserService(new UserRepository());
    const isUserCreated = userService.registerUser(userData);
    if (isUserCreated === false) {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(200).json({ message: "new user registerd" });
  },

  login: (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const userService = new UserService(new UserRepository());
    const token = userService.loginUser(email, password);
    if (token === undefined) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login endpoint hit", token });
  },
};
