import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import * as hrmDashboardController from "./hrmDashboard.controller";

const router = express.Router();

// GET /api/v1/hrm/dashboard/stats (Super Admin, Admin, HR Manager)
router.get(
  "/dashboard/stats",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  hrmDashboardController.getHrmDashboardStats
);

export const HrmDashboardRoutes = router;
