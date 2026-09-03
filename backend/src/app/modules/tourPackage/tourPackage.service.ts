import { prisma } from "../../utils/prisma";
import path from "path";
import fs from "fs";

export const createPackage = async (data: any) => {
  const title = data.title || "Untitled Package";
  const slug = data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  const { itinerary, hotels, ...packageData } = data;

  // Process location string / object to populate locationId & locationName
  if (packageData.location !== undefined) {
    const rawLoc = packageData.location;
    delete packageData.location; // Delete property to prevent Prisma relation type error

    if (rawLoc) {
      if (typeof rawLoc === "string") {
        const foundLoc = await prisma.tourLocation.findFirst({
          where: {
            OR: [
              { id: rawLoc },
              { country: { equals: rawLoc, mode: "insensitive" } },
              { slug: { equals: rawLoc, mode: "insensitive" } },
            ],
          },
        });
        if (foundLoc) {
          packageData.locationId = foundLoc.id;
          packageData.locationName = foundLoc.country;
        } else {
          packageData.locationName = rawLoc;
        }
      } else if (typeof rawLoc === "object" && rawLoc.id) {
        packageData.locationId = rawLoc.id;
        packageData.locationName = rawLoc.country || rawLoc.name || null;
      }
    }
  }

  return await prisma.tourPackage.create({
    data: {
      ...packageData,
      title,
      slug,
      price: typeof packageData.price === "number" ? packageData.price : parseFloat(packageData.price) || 0,
      discountPrice: packageData.discountPrice ? parseFloat(packageData.discountPrice) : null,
      itinerary: itinerary && Array.isArray(itinerary) ? {
        create: itinerary.map((item: any, idx: number) => ({
          dayName: item.dayName || `Day ${idx + 1}`,
          title: item.title || `Day ${idx + 1}`,
          description: item.description || "",
          image: item.image || null,
          sortOrder: idx + 1,
        })),
      } : undefined,
      hotels: hotels && Array.isArray(hotels) ? {
        create: hotels.map((h: any) => ({
          city: h.city || "Destination",
          hotelName: h.hotelName || "Hotel",
          roomType: h.roomType || null,
          rating: h.rating ? parseInt(h.rating) : 4,
        })),
      } : undefined,
    },
    include: {
      location: true,
      itinerary: { orderBy: { sortOrder: "asc" } },
      hotels: true,
    },
  });
};

export const getAllPackages = async (query: {
  search?: string;
  location?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: any = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { locationName: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.location) {
    where.OR = [
      { locationName: { equals: query.location, mode: "insensitive" } },
      { location: { country: { equals: query.location, mode: "insensitive" } } },
      { location: { slug: { equals: query.location, mode: "insensitive" } } },
    ];
  }

  if (typeof query.isFeatured === "boolean") {
    where.isFeatured = query.isFeatured;
  }

  if (typeof query.isPublished === "boolean") {
    where.isPublished = query.isPublished;
  }

  const page = query.page || 1;
  const limit = query.limit || 50;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.tourPackage.count({ where }),
    prisma.tourPackage.findMany({
      where,
      skip,
      take: limit,
      include: {
        location: true,
        itinerary: { orderBy: { sortOrder: "asc" } },
        hotels: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

export const getPackageBySlugOrId = async (slugOrId: string) => {
  return await prisma.tourPackage.findFirst({
    where: {
      OR: [{ id: slugOrId }, { slug: slugOrId }],
    },
    include: {
      location: true,
      itinerary: { orderBy: { sortOrder: "asc" } },
      hotels: true,
      gallery: true,
    },
  });
};

export const updatePackage = async (id: string, data: any) => {
  const { itinerary, hotels, ...packageData } = data;

  if (packageData.title && !packageData.slug) {
    packageData.slug = packageData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  if (packageData.price !== undefined) {
    packageData.price = typeof packageData.price === "number" ? packageData.price : parseFloat(packageData.price) || 0;
  }

  if (packageData.discountPrice !== undefined) {
    packageData.discountPrice = packageData.discountPrice ? parseFloat(packageData.discountPrice) : null;
  }

  // Process location string / object to populate locationId & locationName
  if (packageData.location !== undefined) {
    const rawLoc = packageData.location;
    delete packageData.location; // Delete property to prevent Prisma relation type error

    if (rawLoc) {
      if (typeof rawLoc === "string") {
        const foundLoc = await prisma.tourLocation.findFirst({
          where: {
            OR: [
              { id: rawLoc },
              { country: { equals: rawLoc, mode: "insensitive" } },
              { slug: { equals: rawLoc, mode: "insensitive" } },
            ],
          },
        });
        if (foundLoc) {
          packageData.locationId = foundLoc.id;
          packageData.locationName = foundLoc.country;
        } else {
          packageData.locationName = rawLoc;
        }
      } else if (typeof rawLoc === "object" && rawLoc.id) {
        packageData.locationId = rawLoc.id;
        packageData.locationName = rawLoc.country || rawLoc.name || null;
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.tourPackage.update({
      where: { id },
      data: packageData,
    });

    if (Array.isArray(itinerary)) {
      await tx.packageItinerary.deleteMany({ where: { packageId: id } });
      if (itinerary.length > 0) {
        await tx.packageItinerary.createMany({
          data: itinerary.map((item: any, idx: number) => ({
            packageId: id,
            dayName: item.dayName || `Day ${idx + 1}`,
            title: item.title || `Day ${idx + 1}`,
            description: item.description || "",
            image: item.image || null,
            sortOrder: idx + 1,
          })),
        });
      }
    }

    if (Array.isArray(hotels)) {
      await tx.packageHotel.deleteMany({ where: { packageId: id } });
      if (hotels.length > 0) {
        await tx.packageHotel.createMany({
          data: hotels.map((h: any) => ({
            packageId: id,
            city: h.city || "Destination",
            hotelName: h.hotelName || "Hotel",
            roomType: h.roomType || null,
            rating: h.rating ? parseInt(h.rating) : 4,
          })),
        });
      }
    }
  });

  return await getPackageBySlugOrId(id);
};

export const deletePackage = async (id: string) => {
  const item = await prisma.tourPackage.findUnique({ where: { id } });
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
          console.error("Error unlinking tour package image:", err);
        }
      }
    };

    cleanupFile(item.image);
    cleanupFile(item.featuredImage);
    if (Array.isArray(item.galleryImages)) {
      item.galleryImages.forEach((img: string) => cleanupFile(img));
    }
  }

  return await prisma.tourPackage.delete({
    where: { id },
  });
};
