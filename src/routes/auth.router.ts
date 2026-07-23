// cypod-telemetry
import express from "express";
import { userController } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../dtos/auth.dto.js";

const router = express.Router();

router.post("/register", validate(registerSchema), userController.register);

router.post("/login", validate(loginSchema), userController.login);

export default router;
