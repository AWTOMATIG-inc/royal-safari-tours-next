import { prisma } from "../../utils/prisma";

export const getHrmDashboardStats = async () => {
  const [
    totalEmployees,
    activeEmployees,
    probationEmployees,
    inactiveEmployees,
    departments,
    recentJoins,
  ] = await Promise.all([
    // 1. Total employees
    prisma.employee.count(),

    // 2. Active employees
    prisma.employee.count({
      where: {
        employmentStatus: {
          name: {
            equals: "Active",
            mode: "insensitive",
          },
        },
      },
    }),

    // 3. Probation employees
    prisma.employee.count({
      where: {
        employmentStatus: {
          name: {
            equals: "Probation",
            mode: "insensitive",
          },
        },
      },
    }),

    // 4. Inactive employees
    prisma.employee.count({
      where: {
        employmentStatus: {
          name: {
            equals: "Inactive",
            mode: "insensitive",
          },
        },
      },
    }),

    // 5. Department breakdown
    prisma.department.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { name: "asc" },
    }),

    // 6. Recent joins (last 5)
    prisma.employee.findMany({
      take: 5,
      orderBy: { joiningDate: "desc" },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        photo: true,
        joiningDate: true,
        department: {
          select: { name: true },
        },
        designation: {
          select: { name: true },
        },
        employmentStatus: {
          select: { name: true },
        },
      },
    }),
  ]);

  const departmentBreakdown = departments.map((dept) => ({
    departmentId: dept.id,
    name: dept.name,
    count: dept._count.employees,
  }));

  return {
    totalEmployees,
    activeEmployees,
    probationEmployees,
    inactiveEmployees,
    departmentBreakdown,
    recentJoins,
  };
};
