import { Request, Response } from "express";
import { StatusCodes } from "http-status-toolkit";
import * as jobPostService from "./jobPost.service";

export const getPublicJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      search: req.query.search as string,
      location: req.query.location as string,
      workMode: req.query.workMode as string,
    };
    const result = await jobPostService.getPublicJobs(filters);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Public job postings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve public job postings",
    });
  }
};

export const getPublicJobBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const result = await jobPostService.getPublicJobBySlug(slug);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job details retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error: error.message || "Job position not found",
    });
  }
};

export const submitJobApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Resume / CV file is required",
      });
      return;
    }

    const resumeUrl = `/uploads/documents/${req.file.filename}`;
    const result = await jobPostService.submitJobApplication(slug, req.body, resumeUrl);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Job application submitted successfully! Thank you for applying.",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to submit job application",
    });
  }
};

export const getAdminJobs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await jobPostService.getAdminJobs();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin job postings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve admin job postings",
    });
  }
};

export const createJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await jobPostService.createJobPost(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Job post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to create job post",
    });
  }
};

export const updateJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await jobPostService.updateJobPost(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job post updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update job post",
    });
  }
};

export const deleteJobPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await jobPostService.deleteJobPost(id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job post deleted successfully",
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to delete job post",
    });
  }
};

export const getAdminJobApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      jobPostId: req.query.jobPostId as string,
      status: req.query.status as string,
      search: req.query.search as string,
    };
    const result = await jobPostService.getAdminJobApplications(filters);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job applications retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || "Failed to retrieve job applications",
    });
  }
};

export const updateJobApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await jobPostService.updateJobApplicationStatus(id, req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Job application status updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message || "Failed to update job application status",
    });
  }
};
