import { prisma } from "../../utils/prisma";

export const createSubscriber = async (data: { email: string; name?: string }) => {
  return await prisma.newsletterSubscriber.upsert({
    where: { email: data.email },
    update: { isActive: true },
    create: {
      name: data.name || null,
      email: data.email,
      isActive: true,
    },
  });
};

export const getAllSubscribers = async (query: { search?: string; page?: number; limit?: number }) => {
  const where: any = {};
  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: "insensitive" } },
      { name: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const page = query.page || 1;
  const limit = query.limit || 50;
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.newsletterSubscriber.count({ where }),
    prisma.newsletterSubscriber.findMany({
      where,
      skip,
      take: limit,
      orderBy: { subscribedAt: "desc" },
    }),
  ]);

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data,
  };
};

export const deleteSubscriber = async (id: string) => {
  return await prisma.newsletterSubscriber.delete({
    where: { id },
  });
};
