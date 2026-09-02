import { AttendanceStatus } from "@prisma/client";
import { prisma } from "../../utils/prisma";

export const getOrCreatePolicy = async () => {
  let policy = await prisma.attendancePolicy.findFirst();
  if (!policy) {
    policy = await prisma.attendancePolicy.create({
      data: {
        workStartTime: "09:00",
        workEndTime: "18:00",
        lateGraceMinutes: 15,
        earlyOutGraceMinutes: 15,
        halfDayHours: 4.0,
      },
    });
  }
  return policy;
};

/**
 * Extracts date and time components in Asia/Dhaka timezone (UTC+6)
 */
export const getDhakaTimeParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "0";
  const year = parseInt(getPart("year"), 10);
  const month = parseInt(getPart("month"), 10) - 1; // 0-indexed
  const day = parseInt(getPart("day"), 10);
  const rawHour = parseInt(getPart("hour"), 10);
  const hour = rawHour === 24 ? 0 : rawHour;
  const minute = parseInt(getPart("minute"), 10);
  const second = parseInt(getPart("second"), 10);

  return { year, month, day, hour, minute, second };
};

const getNormalizedToday = (): Date => {
  const { year, month, day } = getDhakaTimeParts();
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
};

export const checkIn = async (
  userId: string,
  userEmail: string,
  payload: {
    latitude?: number;
    longitude?: number;
    locationName?: string;
    remarks?: string;
  },
  ipAddress?: string
) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  const today = getNormalizedToday();

  const existing = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: employee.id,
        date: today,
      },
    },
  });

  if (existing) {
    throw new Error("You have already checked in for today");
  }

  const policy = await getOrCreatePolicy();
  const now = new Date();

  // Compute late threshold based on Asia/Dhaka local time
  const { hour: currentHour, minute: currentMinute } = getDhakaTimeParts(now);
  const currentMinutes = currentHour * 60 + currentMinute;

  const [startHour, startMin] = policy.workStartTime.split(":").map(Number);
  const thresholdMinutes = startHour * 60 + startMin + policy.lateGraceMinutes;

  const isLate = currentMinutes > thresholdMinutes;
  const status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

  return await prisma.attendance.create({
    data: {
      employeeId: employee.id,
      date: today,
      checkInTime: now,
      status,
      isLate,
      ipAddress: ipAddress || null,
      checkInLatitude: payload.latitude || null,
      checkInLongitude: payload.longitude || null,
      checkInLocationName: payload.locationName || null,
      remarks: payload.remarks ? payload.remarks.trim() : null,
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        },
      },
    },
  });
};

export const checkOut = async (
  userId: string,
  userEmail: string,
  payload: {
    latitude?: number;
    longitude?: number;
    locationName?: string;
    remarks?: string;
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

  const today = getNormalizedToday();

  const attendance = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: employee.id,
        date: today,
      },
    },
  });

  if (!attendance) {
    throw new Error("No check-in record found for today. Please check in first.");
  }

  if (attendance.checkOutTime) {
    throw new Error("You have already checked out for today");
  }

  const policy = await getOrCreatePolicy();
  const now = new Date();

  const diffMs = now.getTime() - new Date(attendance.checkInTime).getTime();
  const rawHours = diffMs / (1000 * 60 * 60);
  const workHours = Math.round(rawHours * 100) / 100;

  // Compute early out threshold based on Asia/Dhaka local time
  const { hour: currentOutHour, minute: currentOutMinute } = getDhakaTimeParts(now);
  const currentOutMinutes = currentOutHour * 60 + currentOutMinute;

  const [endHour, endMin] = policy.workEndTime.split(":").map(Number);
  const earlyThresholdMinutes = endHour * 60 + endMin - policy.earlyOutGraceMinutes;

  const isEarlyOut = currentOutMinutes < earlyThresholdMinutes;

  let finalStatus = attendance.status;
  if (workHours < policy.halfDayHours) {
    finalStatus = AttendanceStatus.HALF_DAY;
  }

  return await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOutTime: now,
      workHours,
      isEarlyOut,
      status: finalStatus,
      checkOutLatitude: payload.latitude || null,
      checkOutLongitude: payload.longitude || null,
      checkOutLocationName: payload.locationName || null,
      ...(payload.remarks && { remarks: payload.remarks.trim() }),
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        },
      },
    },
  });
};

export const getTodayStatus = async (userId: string, userEmail: string) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  const today = getNormalizedToday();
  const policy = await getOrCreatePolicy();

  const attendance = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId: employee.id,
        date: today,
      },
    },
  });

  return {
    employeeId: employee.id,
    hasCheckedIn: Boolean(attendance?.checkInTime),
    hasCheckedOut: Boolean(attendance?.checkOutTime),
    attendance: attendance || null,
    policy,
  };
};

export const getMyAttendanceHistory = async (
  userId: string,
  userEmail: string,
  month?: number,
  year?: number
) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this user account");
  }

  const targetYear = year || new Date().getFullYear();
  const targetMonth = month !== undefined ? month : new Date().getMonth();

  const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
  const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));

  const attendances = await prisma.attendance.findMany({
    where: {
      employeeId: employee.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalPresent = attendances.filter(
    (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE
  ).length;
  const totalLate = attendances.filter((a) => a.isLate).length;
  const totalHours = attendances.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
  const avgHours = totalPresent > 0 ? Math.round((totalHours / totalPresent) * 10) / 10 : 0;

  return {
    summary: {
      totalPresent,
      totalLate,
      totalHours: Math.round(totalHours * 10) / 10,
      avgHours,
    },
    attendances,
  };
};

export const getAdminTodayAttendance = async (dateStr?: string) => {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const normalizedDate = new Date(
    Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  );

  const policy = await getOrCreatePolicy();
  const allEmployees = await prisma.employee.findMany({
    include: {
      department: true,
      designation: true,
    },
    orderBy: { name: "asc" },
  });

  const todayAttendances = await prisma.attendance.findMany({
    where: { date: normalizedDate },
  });

  const attendanceMap = new Map(todayAttendances.map((a) => [a.employeeId, a]));

  const activeLeaves = await prisma.leaveApplication.findMany({
    where: {
      status: "APPROVED",
      startDate: { lte: targetDate },
      endDate: { gte: targetDate },
    },
  });
  const onLeaveSet = new Set(activeLeaves.map((l) => l.employeeId));

  const records = allEmployees.map((emp) => {
    const attendance = attendanceMap.get(emp.id);
    const isOnLeave = onLeaveSet.has(emp.id);

    let calculatedStatus: string = "ABSENT";
    if (attendance) {
      calculatedStatus = attendance.status;
    } else if (isOnLeave) {
      calculatedStatus = "ON_LEAVE";
    }

    return {
      employee: {
        id: emp.id,
        name: emp.name,
        employeeId: emp.employeeId,
        email: emp.email,
        photo: emp.photo,
        department: emp.department?.name || "—",
        designation: emp.designation?.name || "—",
      },
      attendance: attendance || null,
      status: calculatedStatus,
      isLate: attendance?.isLate || false,
      isEarlyOut: attendance?.isEarlyOut || false,
    };
  });

  const presentCount = records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
  const lateCount = records.filter((r) => r.isLate).length;
  const onLeaveCount = records.filter((r) => r.status === "ON_LEAVE").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;

  return {
    date: normalizedDate,
    policy,
    summary: {
      totalEmployees: allEmployees.length,
      presentCount,
      lateCount,
      onLeaveCount,
      absentCount,
    },
    records,
  };
};

export const getAdminAttendanceReport = async (filters: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  status?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      const s = new Date(filters.startDate);
      where.date.gte = new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate()));
    }
    if (filters.endDate) {
      const e = new Date(filters.endDate);
      where.date.lte = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59));
    }
  }

  if (filters.status && Object.values(AttendanceStatus).includes(filters.status as AttendanceStatus)) {
    where.status = filters.status as AttendanceStatus;
  }

  if (filters.departmentId) {
    where.employee = { departmentId: filters.departmentId };
  }

  if (filters.search) {
    where.OR = [
      { employee: { name: { contains: filters.search, mode: "insensitive" } } },
      { employee: { employeeId: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return await prisma.attendance.findMany({
    where,
    include: {
      employee: {
        include: {
          department: true,
          designation: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const updateAttendancePolicy = async (payload: {
  workStartTime?: string;
  workEndTime?: string;
  lateGraceMinutes?: number;
  earlyOutGraceMinutes?: number;
  halfDayHours?: number;
}) => {
  const policy = await getOrCreatePolicy();

  return await prisma.attendancePolicy.update({
    where: { id: policy.id },
    data: {
      ...(payload.workStartTime && { workStartTime: payload.workStartTime }),
      ...(payload.workEndTime && { workEndTime: payload.workEndTime }),
      ...(payload.lateGraceMinutes !== undefined && { lateGraceMinutes: payload.lateGraceMinutes }),
      ...(payload.earlyOutGraceMinutes !== undefined && { earlyOutGraceMinutes: payload.earlyOutGraceMinutes }),
      ...(payload.halfDayHours !== undefined && { halfDayHours: payload.halfDayHours }),
    },
  });
};

export const getAdminMonthlySummary = async (
  month?: number,
  year?: number,
  departmentId?: string,
  search?: string
) => {
  const targetYear = year || new Date().getFullYear();
  const targetMonth = month !== undefined ? month : new Date().getMonth();

  const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
  const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));

  const now = new Date();
  const endLimit = now < endDate ? now : endDate;
  let totalWorkableDays = 0;
  const tempDate = new Date(startDate);
  while (tempDate <= endLimit) {
    totalWorkableDays++;
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const whereEmployee: any = {};
  if (departmentId) whereEmployee.departmentId = departmentId;
  if (search) {
    whereEmployee.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { employeeId: { contains: search, mode: "insensitive" } },
    ];
  }

  const employees = await prisma.employee.findMany({
    where: whereEmployee,
    include: {
      department: true,
      designation: true,
    },
    orderBy: { name: "asc" },
  });

  const attendances = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const approvedLeaves = await prisma.leaveApplication.findMany({
    where: {
      status: "APPROVED",
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
  });

  const summary = employees.map((emp) => {
    const empAttendances = attendances.filter((a) => a.employeeId === emp.id);
    const presentDays = empAttendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
    const lateDays = empAttendances.filter((a) => a.isLate || a.status === AttendanceStatus.LATE).length;

    const empLeaves = approvedLeaves.filter((l) => l.employeeId === emp.id);
    let onLeaveDays = 0;
    empLeaves.forEach((l) => {
      const s = new Date(l.startDate) < startDate ? startDate : new Date(l.startDate);
      const e = new Date(l.endDate) > endDate ? endDate : new Date(l.endDate);
      if (s <= e) {
        const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        onLeaveDays += diff;
      }
    });

    const attendedDays = presentDays + lateDays;
    const absentDays = Math.max(0, totalWorkableDays - (attendedDays + onLeaveDays));
    const totalHours = empAttendances.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
    const avgHours = attendedDays > 0 ? Math.round((totalHours / attendedDays) * 10) / 10 : 0;

    return {
      employee: {
        id: emp.id,
        name: emp.name,
        employeeId: emp.employeeId,
        email: emp.email,
        photo: emp.photo,
        department: emp.department?.name || "—",
        designation: emp.designation?.name || "—",
      },
      presentDays,
      lateDays,
      onLeaveDays,
      absentDays,
      totalHours: Math.round(totalHours * 10) / 10,
      avgHours,
    };
  });

  return {
    month: targetMonth,
    year: targetYear,
    summary,
  };
};

export const getEmployeeMonthlyDetailedLog = async (
  employeeId: string,
  month?: number,
  year?: number
) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      department: true,
      designation: true,
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const targetYear = year || new Date().getFullYear();
  const targetMonth = month !== undefined ? month : new Date().getMonth();

  const startDate = new Date(Date.UTC(targetYear, targetMonth, 1));
  const endDate = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));

  const attendances = await prisma.attendance.findMany({
    where: {
      employeeId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const presentDays = attendances.filter((a) => a.status === AttendanceStatus.PRESENT).length;
  const lateDays = attendances.filter((a) => a.isLate || a.status === AttendanceStatus.LATE).length;
  const totalHours = attendances.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
  const avgHours = (presentDays + lateDays) > 0 ? Math.round((totalHours / (presentDays + lateDays)) * 10) / 10 : 0;

  return {
    employee: {
      id: employee.id,
      name: employee.name,
      employeeId: employee.employeeId,
      email: employee.email,
      photo: employee.photo,
      department: employee.department?.name || "—",
      designation: employee.designation?.name || "—",
    },
    month: targetMonth,
    year: targetYear,
    summary: {
      presentDays,
      lateDays,
      totalHours: Math.round(totalHours * 10) / 10,
      avgHours,
    },
    attendances,
  };
};
