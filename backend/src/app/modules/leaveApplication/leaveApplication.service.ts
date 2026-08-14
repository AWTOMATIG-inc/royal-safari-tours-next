import { LeaveStatus, Role } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { ensureDefaultLeaveTypes } from "../leaveType/leaveType.service";

export const ensureEmployeeLeaveBalances = async (
  employeeId: string,
  year: number = new Date().getFullYear()
) => {
  await ensureDefaultLeaveTypes();

  const leaveTypes = await prisma.leaveType.findMany();

  for (const leaveType of leaveTypes) {
    await prisma.employeeLeaveBalance.upsert({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId: leaveType.id,
          year,
        },
      },
      update: {
        totalDays: leaveType.defaultDaysPerYear,
      },
      create: {
        employeeId,
        leaveTypeId: leaveType.id,
        year,
        totalDays: leaveType.defaultDaysPerYear,
        usedDays: 0,
      },
    });
  }
};

export const getMyLeaveBalances = async (
  userId: string,
  userEmail: string,
  requestedYear?: number
) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  const targetYear = requestedYear || new Date().getFullYear();
  await ensureEmployeeLeaveBalances(employee.id, targetYear);

  return await prisma.employeeLeaveBalance.findMany({
    where: {
      employeeId: employee.id,
      year: targetYear,
    },
    include: {
      leaveType: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const provisionAllEmployeesLeaveBalances = async (
  year: number = new Date().getFullYear()
) => {
  await ensureDefaultLeaveTypes();
  const activeEmployees = await prisma.employee.findMany({ select: { id: true } });
  for (const emp of activeEmployees) {
    await ensureEmployeeLeaveBalances(emp.id, year);
  }
  return { year, count: activeEmployees.length };
};

export const getMyLeaveApplications = async (userId: string, userEmail: string) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  return await prisma.leaveApplication.findMany({
    where: {
      employeeId: employee.id,
    },
    include: {
      leaveType: true,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
};

export const applyLeave = async (
  userId: string,
  userEmail: string,
  payload: {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }
) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  const start = new Date(payload.startDate);
  const end = new Date(payload.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid start or end date format");
  }

  if (start > end) {
    throw new Error("Start date must be before or equal to end date");
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const year = start.getFullYear();
  await ensureEmployeeLeaveBalances(employee.id, year);

  const balance = await prisma.employeeLeaveBalance.findUnique({
    where: {
      employeeId_leaveTypeId_year: {
        employeeId: employee.id,
        leaveTypeId: payload.leaveTypeId,
        year,
      },
    },
    include: { leaveType: true },
  });

  if (!balance) {
    throw new Error("Leave balance record not found for this leave type");
  }

  const remainingDays = balance.totalDays - balance.usedDays;
  if (remainingDays <= 0) {
    throw new Error(
      `You have exhausted all allocated days for ${balance.leaveType.name} in ${year}. You cannot apply for more ${balance.leaveType.name} leave this year.`
    );
  }

  if (requestedDays > remainingDays) {
    throw new Error(
      `Insufficient leave balance. You requested ${requestedDays} day(s), but only have ${remainingDays} day(s) remaining for ${balance.leaveType.name} in ${year}.`
    );
  }

  return await prisma.leaveApplication.create({
    data: {
      employeeId: employee.id,
      leaveTypeId: payload.leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays: requestedDays,
      reason: payload.reason.trim(),
      status: LeaveStatus.PENDING,
    },
    include: {
      leaveType: true,
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          employeeId: true,
        },
      },
    },
  });
};

export const getAllLeaveApplications = async (
  user: { id: string; email: string; role: string },
  filters: {
    status?: string;
    departmentId?: string;
    search?: string;
  }
) => {
  const where: any = {};

  if (user.role === Role.EMPLOYEE) {
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [{ userId: user.id }, { email: user.email }],
      },
    });

    if (employee) {
      where.employeeId = employee.id;
    } else {
      return [];
    }
  }

  if (filters.status && Object.values(LeaveStatus).includes(filters.status as LeaveStatus)) {
    where.status = filters.status as LeaveStatus;
  }

  if (filters.departmentId) {
    where.employee = {
      ...(where.employee || {}),
      departmentId: filters.departmentId,
    };
  }

  if (filters.search) {
    const searchConditions = [
      { employee: { name: { contains: filters.search, mode: "insensitive" } } },
      { employee: { employeeId: { contains: filters.search, mode: "insensitive" } } },
      { reason: { contains: filters.search, mode: "insensitive" } },
    ];
    if (where.employeeId) {
      where.AND = [{ employeeId: where.employeeId }, { OR: searchConditions }];
      delete where.employeeId;
    } else {
      where.OR = searchConditions;
    }
  }

  return await prisma.leaveApplication.findMany({
    where,
    include: {
      leaveType: true,
      employee: {
        include: {
          department: true,
          designation: true,
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });
};

export const updateLeaveApplicationStatus = async (
  id: string,
  adminUserId: string,
  payload: {
    status: LeaveStatus;
    rejectionReason?: string;
  }
) => {
  const application = await prisma.leaveApplication.findUnique({
    where: { id },
    include: {
      employee: true,
      leaveType: true,
    },
  });

  if (!application) {
    throw new Error("Leave application not found");
  }

  const year = new Date(application.startDate).getFullYear();
  await ensureEmployeeLeaveBalances(application.employeeId, year);

  const balance = await prisma.employeeLeaveBalance.findUnique({
    where: {
      employeeId_leaveTypeId_year: {
        employeeId: application.employeeId,
        leaveTypeId: application.leaveTypeId,
        year,
      },
    },
  });

  if (payload.status === LeaveStatus.APPROVED && application.status !== LeaveStatus.APPROVED) {
    if (balance) {
      await prisma.employeeLeaveBalance.update({
        where: { id: balance.id },
        data: {
          usedDays: balance.usedDays + application.totalDays,
        },
      });
    }
  } else if (application.status === LeaveStatus.APPROVED && payload.status !== LeaveStatus.APPROVED) {
    if (balance) {
      await prisma.employeeLeaveBalance.update({
        where: { id: balance.id },
        data: {
          usedDays: Math.max(0, balance.usedDays - application.totalDays),
        },
      });
    }
  }

  return await prisma.leaveApplication.update({
    where: { id },
    data: {
      status: payload.status,
      approvedById: adminUserId,
      rejectionReason: payload.rejectionReason ? payload.rejectionReason.trim() : null,
    },
    include: {
      leaveType: true,
      employee: {
        include: {
          department: true,
          designation: true,
        },
      },
    },
  });
};

export const updateEmployeeLeaveBalance = async (
  balanceId: string,
  payload: { totalDays: number }
) => {
  const balance = await prisma.employeeLeaveBalance.findUnique({
    where: { id: balanceId },
  });

  if (!balance) {
    throw new Error("Employee leave balance record not found");
  }

  return await prisma.employeeLeaveBalance.update({
    where: { id: balanceId },
    data: {
      totalDays: payload.totalDays,
    },
    include: {
      leaveType: true,
      employee: true,
    },
  });
};
