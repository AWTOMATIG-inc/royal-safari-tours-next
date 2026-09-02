import { Router } from "express";
import * as testimonialController from "./testimonial.controller";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", testimonialController.getAllTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.post("/", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), testimonialController.createTestimonial);
router.put("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), testimonialController.updateTestimonial);
router.delete("/:id", auth(), authorize(Role.SUPER_ADMIN, Role.ADMIN), testimonialController.deleteTestimonial);

export default router;
