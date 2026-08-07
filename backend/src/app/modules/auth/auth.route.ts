import express from "express";
import * as authController from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerSchema, loginSchema } from "./auth.validation";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/profile", auth(), authController.profile);

export const AuthRoutes = router;
