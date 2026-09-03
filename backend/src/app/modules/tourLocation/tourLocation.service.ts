import { prisma } from "../../utils/prisma";
import path from "path";
import fs from "fs";

export const createLocation = async (data: any) => {
  const country = data.country || data.name || "Untitled Location";
  let slug = data.slug || country.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  // Ensure unique slug
  let existing = await prisma.tourLocation.findFirst({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  return await prisma.tourLocation.create({
    data: {
      country,
      slug,
      image: data.image || null,
      description: data.description || null,
      isFeatured: data.isFeatured !== false,
    },
  });
};

export const getAllLocations = async (query: {
  search?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: any = {};
  if (query.search) {
    where.country = { contains: query.search, mode: "insensitive" };
  }
  if (typeof query.isFeatured === "boolean") {
    where.isFeatured = query.isFeatured;
  }

  if (query.page !== undefined || query.limit !== undefined) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.tourLocation.count({ where }),
      prisma.tourLocation.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { packages: true },
          },
        },
        orderBy: { createdAt: "desc" },
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

  return await prisma.tourLocation.findMany({
    where,
    include: {
      _count: {
        select: { packages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getLocationByIdOrSlug = async (idOrSlug: string) => {
  return await prisma.tourLocation.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }, { country: { equals: idOrSlug, mode: "insensitive" } }],
    },
    include: {
      packages: true,
      gallery: true,
    },
  });
};

export const updateLocation = async (id: string, data: any) => {
  if (data.country && !data.slug) {
    data.slug = data.country.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  }
  return await prisma.tourLocation.update({
    where: { id },
    data,
  });
};

export const deleteLocation = async (id: string) => {
  const item = await prisma.tourLocation.findUnique({ where: { id } });
  if (item && item.image) {
    const baseUploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.resolve(process.cwd(), "uploads");

    const relPath = item.image.replace(/^\/?(api\/)?uploads\//, "");
    const fullPath = path.resolve(baseUploadsDir, relPath);
    if (fullPath.startsWith(baseUploadsDir) && fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error("Error unlinking tour location image:", err);
      }
    }
  }

  return await prisma.tourLocation.delete({
    where: { id },
  });
};
