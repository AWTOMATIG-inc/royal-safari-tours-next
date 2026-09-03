import { prisma } from "../../utils/prisma";
import path from "path";
import fs from "fs";

export const createTestimonial = async (data: any) => {
  return await prisma.testimonial.create({
    data: {
      name: data.name || "Traveler",
      country: data.country || "Bangladesh",
      feedback: data.feedback || "",
      rating: data.rating ? parseInt(data.rating) : 5,
      backgroundImage: data.backgroundImage || null,
      avatarImage: data.avatarImage || null,
      isPublished: data.isPublished !== false,
      sortOrder: data.sortOrder || 0,
    },
  });
};

export const getAllTestimonials = async (query: {
  isPublished?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: any = {};
  if (typeof query.isPublished === "boolean") {
    where.isPublished = query.isPublished;
  }

  if (query.page !== undefined || query.limit !== undefined) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    ]);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      data,
    };
  }

  return await prisma.testimonial.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
};

export const getTestimonialById = async (id: string) => {
  return await prisma.testimonial.findUnique({
    where: { id },
  });
};

export const updateTestimonial = async (id: string, data: any) => {
  return await prisma.testimonial.update({
    where: { id },
    data,
  });
};

export const deleteTestimonial = async (id: string) => {
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (item) {
    const baseUploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.resolve(process.cwd(), "uploads");

    const cleanupFile = (urlOrName?: string | null) => {
      if (!urlOrName) return;
      const relPath = urlOrName.replace(/^\/?(api\/)?uploads\//, "");
      const fullPath = path.resolve(baseUploadsDir, relPath);
      if (fullPath.startsWith(baseUploadsDir) && fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error("Error unlinking testimonial image:", err);
        }
      }
    };

    cleanupFile(item.backgroundImage);
    cleanupFile(item.avatarImage);
  }

  return await prisma.testimonial.delete({
    where: { id },
  });
};
