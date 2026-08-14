import express from "express";
import * as authController from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from "./auth.validation";
import { auth } from "../../middlewares/auth";
import { authRateLimiter, strictRateLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.post("/register", authRateLimiter, validateRequest(registerSchema), authController.register);
router.post("/login", authRateLimiter, validateRequest(loginSchema), authController.login);
router.post("/refresh-token", strictRateLimiter, validateRequest(refreshTokenSchema), authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/change-password", auth(), validateRequest(changePasswordSchema), authController.changePassword);
router.get("/profile", auth(), authController.profile);

export const AuthRoutes = router;
