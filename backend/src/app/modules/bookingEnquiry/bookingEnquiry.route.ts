import { Router } from "express";
import * as bookingEnquiryController from "./bookingEnquiry.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

// Public booking enquiry submission
router.post("/", bookingEnquiryController.createBookingEnquiry);

// Admin-only management endpoints
router.get("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE), bookingEnquiryController.getAllBookingEnquiries);
router.get("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE), bookingEnquiryController.getBookingEnquiryById);
router.patch("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE), bookingEnquiryController.updateBookingEnquiry);
router.patch("/:id/status", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER, Role.EMPLOYEE), bookingEnquiryController.updateBookingEnquiry);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), bookingEnquiryController.deleteBookingEnquiry);

export default router;
