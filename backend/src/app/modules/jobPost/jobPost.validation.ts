import { z } from "zod";

export const createJobPostSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  vacancies: z.number().int().min(1, "Vacancies must be at least 1").default(1),
  officeTime: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  jobType: z.string().min(2, "Job type is required"),
  workMode: z.string().min(2, "Work mode is required"),
  deadline: z.string().min(1, "Application deadline is required"),
  description: z.string().min(5, "Job description is required"),
  responsibilities: z.string().min(5, "Job responsibilities are required"),
  benefits: z.string().optional(),
  customQuestions: z.any().optional(),
  isPublished: z.boolean().optional().default(true),
});

export const updateJobPostSchema = z.object({
  title: z.string().min(2).optional(),
  vacancies: z.number().int().min(1).optional(),
  officeTime: z.string().optional(),
  location: z.string().min(2).optional(),
  jobType: z.string().min(2).optional(),
  workMode: z.string().min(2).optional(),
  deadline: z.string().optional(),
  description: z.string().min(5).optional(),
  responsibilities: z.string().min(5).optional(),
  benefits: z.string().optional(),
  customQuestions: z.any().optional(),
  isPublished: z.boolean().optional(),
});

export const submitJobApplicationSchema = z.object({
  applicantName: z.string().min(2, "Full name is required"),
  applicantEmail: z.string().email("Invalid email format"),
  applicantPhone: z.string().min(6, "Phone number is required"),
  experienceYears: z.string().optional(),
  currentCompany: z.string().optional(),
  expectedSalary: z.string().optional(),
  coverLetter: z.string().optional(),
  answers: z.any().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["SUBMITTED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"]),
  hrNotes: z.string().optional(),
});
