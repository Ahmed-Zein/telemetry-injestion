import express from "express";
import { userController } from "../controllers/user.controller.js";

const router = express.Router();

/*
### [ ] Auth
- `POST /auth/register`, `POST /auth/login` → JWT-based auth
- All device and telemetry routes require a valid token
*/
router.post("/register", userController.register);

router.post("/login", userController.login);

export default router;
