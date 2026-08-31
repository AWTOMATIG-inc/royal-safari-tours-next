import { JobApplicationStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import {
  sendApplicantConfirmationEmail,
  sendAdminNewApplicationEmail,
} from "../auth/emailSender";

const generateSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${randomSuffix}`;
};

export const createJobPost = async (payload: {
  title: string;
  vacancies?: number;
  officeTime?: string;
  location: string;
  jobType: string;
  workMode: string;
  deadline: string;
  description: string;
  responsibilities: string;
  benefits?: string;
  customQuestions?: any;
  isPublished?: boolean;
}) => {
  const slug = generateSlug(payload.title);

  return await prisma.jobPost.create({
    data: {
      title: payload.title.trim(),
      slug,
      vacancies: payload.vacancies || 1,
      officeTime: payload.officeTime ? payload.officeTime.trim() : null,
      location: payload.location.trim(),
      jobType: payload.jobType.trim(),
      workMode: payload.workMode.trim(),
      deadline: new Date(payload.deadline),
      description: payload.description.trim(),
      responsibilities: payload.responsibilities.trim(),
      benefits: payload.benefits ? payload.benefits.trim() : null,
      customQuestions: payload.customQuestions ? payload.customQuestions : null,
      isPublished: payload.isPublished !== undefined ? payload.isPublished : true,
    },
  });
};

export const updateJobPost = async (
  id: string,
  payload: {
    title?: string;
    vacancies?: number;
    officeTime?: string;
    location?: string;
    jobType?: string;
    workMode?: string;
    deadline?: string;
    description?: string;
    responsibilities?: string;
    benefits?: string;
    customQuestions?: any;
    isPublished?: boolean;
  }
) => {
  const existing = await prisma.jobPost.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Job post not found");
  }

  let slug = existing.slug;
  if (payload.title && payload.title.trim() !== existing.title) {
    slug = generateSlug(payload.title);
  }

  return await prisma.jobPost.update({
    where: { id },
    data: {
      ...(payload.title && { title: payload.title.trim(), slug }),
      ...(payload.vacancies !== undefined && { vacancies: payload.vacancies }),
      ...(payload.officeTime !== undefined && { officeTime: payload.officeTime ? payload.officeTime.trim() : null }),
      ...(payload.location && { location: payload.location.trim() }),
      ...(payload.jobType && { jobType: payload.jobType.trim() }),
      ...(payload.workMode && { workMode: payload.workMode.trim() }),
      ...(payload.deadline && { deadline: new Date(payload.deadline) }),
      ...(payload.description && { description: payload.description.trim() }),
      ...(payload.responsibilities && { responsibilities: payload.responsibilities.trim() }),
      ...(payload.benefits !== undefined && { benefits: payload.benefits ? payload.benefits.trim() : null }),
      ...(payload.customQuestions !== undefined && { customQuestions: payload.customQuestions }),
      ...(payload.isPublished !== undefined && { isPublished: payload.isPublished }),
    },
  });
};

export const deleteJobPost = async (id: string) => {
  const existing = await prisma.jobPost.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Job post not found");
  }

  return await prisma.jobPost.delete({ where: { id } });
};

const isJobExpired = (deadline: Date | string): boolean => {
  const d = new Date(deadline);
  d.setHours(23, 59, 59, 999);
  return new Date() > d;
};

export const getPublicJobs = async (filters: {
  search?: string;
  location?: string;
  workMode?: string;
}) => {
  const where: any = { isPublished: true };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.workMode) {
    where.workMode = { contains: filters.workMode, mode: "insensitive" };
  }

  const jobs = await prisma.jobPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  return jobs.map((j) => ({
    ...j,
    isExpired: isJobExpired(j.deadline),
    applicationsCount: j._count.applications,
  }));
};

export const getPublicJobBySlug = async (slug: string) => {
  const job = await prisma.jobPost.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    throw new Error("Job position not found");
  }

  const isExpired = isJobExpired(job.deadline);

  return {
    ...job,
    isExpired,
    applicationsCount: job._count.applications,
  };
};

export const submitJobApplication = async (
  slug: string,
  payload: {
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    experienceYears?: string;
    currentCompany?: string;
    expectedSalary?: string;
    coverLetter?: string;
    answers?: any;
  },
  resumeUrl: string
) => {
  const job = await prisma.jobPost.findUnique({ where: { slug } });
  if (!job) {
    throw new Error("Job position not found");
  }

  if (isJobExpired(job.deadline)) {
    throw new Error("Application deadline for this position has passed. Applications are closed.");
  }

  const cleanEmail = payload.applicantEmail.trim().toLowerCase();
  const cleanPhone = payload.applicantPhone.trim();

  // Prevent duplicate application for the same job with email or phone
  const existingApp = await prisma.jobApplication.findFirst({
    where: {
      jobPostId: job.id,
      OR: [{ applicantEmail: cleanEmail }, { applicantPhone: cleanPhone }],
    },
  });

  if (existingApp) {
    throw new Error("You have already submitted an application for this position with this email address or phone number.");
  }

  const application = await prisma.jobApplication.create({
    data: {
      jobPostId: job.id,
      applicantName: payload.applicantName.trim(),
      applicantEmail: cleanEmail,
      applicantPhone: cleanPhone,
      experienceYears: payload.experienceYears ? payload.experienceYears.trim() : null,
      currentCompany: payload.currentCompany ? payload.currentCompany.trim() : null,
      expectedSalary: payload.expectedSalary ? payload.expectedSalary.trim() : null,
      coverLetter: payload.coverLetter ? payload.coverLetter.trim() : null,
      resumeUrl,
      answers: payload.answers ? payload.answers : null,
      status: JobApplicationStatus.SUBMITTED,
    },
  });

  // Dispatch Dual Emails (non-blocking)
  sendApplicantConfirmationEmail(cleanEmail, payload.applicantName.trim(), job.title).catch(() => {});
  sendAdminNewApplicationEmail(payload.applicantName.trim(), cleanEmail, cleanPhone, job.title).catch(() => {});

  return application;
};

export const getAdminJobs = async () => {
  const jobs = await prisma.jobPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  return jobs.map((j) => ({
    ...j,
    isExpired: isJobExpired(j.deadline),
    applicationsCount: j._count.applications,
  }));
};

export const getAdminJobApplications = async (filters: {
  jobPostId?: string;
  status?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters.jobPostId) {
    where.jobPostId = filters.jobPostId;
  }

  if (filters.status && Object.values(JobApplicationStatus).includes(filters.status as JobApplicationStatus)) {
    where.status = filters.status as JobApplicationStatus;
  }

  if (filters.search) {
    where.OR = [
      { applicantName: { contains: filters.search, mode: "insensitive" } },
      { applicantEmail: { contains: filters.search, mode: "insensitive" } },
      { applicantPhone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return await prisma.jobApplication.findMany({
    where,
    include: {
      jobPost: {
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
};

export const updateJobApplicationStatus = async (
  id: string,
  payload: {
    status: JobApplicationStatus;
    hrNotes?: string;
  }
) => {
  const existing = await prisma.jobApplication.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Job application not found");
  }

  return await prisma.jobApplication.update({
    where: { id },
    data: {
      status: payload.status,
      ...(payload.hrNotes !== undefined && { hrNotes: payload.hrNotes ? payload.hrNotes.trim() : null }),
    },
    include: {
      jobPost: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
};
