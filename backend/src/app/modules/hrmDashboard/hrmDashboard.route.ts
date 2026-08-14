import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import * as hrmDashboardController from "./hrmDashboard.controller";

const router = express.Router();

// GET /api/v1/hrm/dashboard/stats (All Authenticated Roles)
router.get(
  "/dashboard/stats",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE),
  hrmDashboardController.getHrmDashboardStats
);

export const HrmDashboardRoutes = router;
