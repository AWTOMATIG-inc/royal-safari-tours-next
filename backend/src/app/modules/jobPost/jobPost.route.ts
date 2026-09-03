import express from "express";
import { Role } from "@prisma/client";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorize";
import { validateRequest } from "../../middlewares/validateRequest";
import { uploadResumeFile } from "../../middlewares/hrmUpload";
import * as jobPostController from "./jobPost.controller";
import * as jobPostValidation from "./jobPost.validation";

const router = express.Router();

// PUBLIC Candidate Endpoints
// GET /api/v1/jobs/public (All active/expired published jobs)
router.get("/public", jobPostController.getPublicJobs);

// GET /api/v1/jobs/public/:slug (Job details by slug)
router.get("/public/:slug", jobPostController.getPublicJobBySlug);

// POST /api/v1/jobs/public/:slug/apply (Submit application with resume upload - PDF Only)
router.post(
  "/public/:slug/apply",
  uploadResumeFile.single("resume"),
  validateRequest(jobPostValidation.submitJobApplicationSchema),
  jobPostController.submitJobApplication
);

// ADMIN Management Endpoints (Super Admin, Admin, HR Manager)
// GET /api/v1/jobs/admin (List all jobs with application count)
router.get(
  "/admin",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  jobPostController.getAdminJobs
);

// POST /api/v1/jobs/admin (Create new job post)
router.post(
  "/admin",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(jobPostValidation.createJobPostSchema),
  jobPostController.createJobPost
);

// PATCH /api/v1/jobs/admin/:id (Update job post)
router.patch(
  "/admin/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(jobPostValidation.updateJobPostSchema),
  jobPostController.updateJobPost
);

// DELETE /api/v1/jobs/admin/:id (Delete job post)
router.delete(
  "/admin/:id",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  jobPostController.deleteJobPost
);

// GET /api/v1/jobs/admin/applications (List all job applications)
router.get(
  "/admin/applications",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  jobPostController.getAdminJobApplications
);

// PATCH /api/v1/jobs/admin/applications/:id/status (Update application status & HR notes)
router.patch(
  "/admin/applications/:id/status",
  auth(),
  authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.HR_MANAGER),
  validateRequest(jobPostValidation.updateApplicationStatusSchema),
  jobPostController.updateJobApplicationStatus
);

export const JobPostRoutes = router;
