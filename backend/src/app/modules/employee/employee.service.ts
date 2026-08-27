import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";
import { ensureEmployeeLeaveBalances } from "../leaveApplication/leaveApplication.service";

interface CreateEmployeePayload {
  name: string;
  email: string;
  phone?: string;
  departmentId: string;
  designationId: string;
  employmentTypeId: string;
  employmentStatusId: string;
  joiningDate?: string;
  managerId?: string;
  hrNotes?: string;
  createUserAccount?: boolean | string;
  password?: string;
}

interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  designationId?: string;
  employmentTypeId?: string;
  employmentStatusId?: string;
  joiningDate?: string;
  managerId?: string;
  hrNotes?: string;
  createUserAccount?: boolean | string;
  password?: string;
  [key: string]: unknown;
}

interface EmployeeQuery {
  search?: string;
  departmentId?: string;
  designationId?: string;
  employmentStatusId?: string;
  employmentTypeId?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Utility to sanitize optional string values
 */
const sanitizeInput = (val: any): string | null => {
  if (val === undefined || val === null) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    return trimmed;
  }
  return String(val);
};

/**
 * Utility to resolve master records by UUID ID OR Name (case-insensitive)
 */
const findMasterRecord = async (model: any, idOrName: string | null) => {
  if (!idOrName) return null;
  return await model.findFirst({
    where: {
      OR: [
        { id: idOrName },
        { name: { equals: idOrName, mode: "insensitive" } },
      ],
    },
  });
};

/**
 * Service helper to generate a unique, sequential Employee ID per calendar year
 * Example: EMP-2026-0001, EMP-2026-0002
 */
export const generateEmployeeId = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `EMP-${currentYear}-`;

  const lastEmployee = await prisma.employee.findFirst({
    where: {
      employeeId: {
        startsWith: prefix,
      },
    },
    orderBy: {
      employeeId: "desc",
    },
    select: {
      employeeId: true,
    },
  });

  let nextSequence = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const parts = lastEmployee.employeeId.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextSequence = lastSeq + 1;
    }
  }

  const formattedSequence = String(nextSequence).padStart(4, "0");
  return `${prefix}${formattedSequence}`;
};

export const createEmployee = async (
  payload: CreateEmployeePayload,
  photoUrl?: string
) => {
  const name = sanitizeInput(payload.name);
  const email = sanitizeInput(payload.email);
  const phone = sanitizeInput(payload.phone);
  const rawDept = sanitizeInput(payload.departmentId);
  const rawDesig = sanitizeInput(payload.designationId);
  const rawType = sanitizeInput(payload.employmentTypeId);
  const rawStatus = sanitizeInput(payload.employmentStatusId);
  const rawJoiningDate = sanitizeInput(payload.joiningDate);
  const rawManagerId = sanitizeInput(payload.managerId);
  const hrNotes = sanitizeInput(payload.hrNotes);
  const password = sanitizeInput(payload.password);
  const createUserAccount = payload.createUserAccount;

  if (!name) throw new Error("Employee name is required");
  if (!email) throw new Error("Employee email is required");
  if (!rawDept) throw new Error("Department ID or Name is required");
  if (!rawDesig) throw new Error("Designation ID or Name is required");
  if (!rawType) throw new Error("Employment Type ID or Name is required");
  if (!rawStatus) throw new Error("Employment Status ID or Name is required");

  // 1. Check duplicate email in Employee table
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });
  if (existingEmployee) {
    throw new Error("Employee with this email already exists");
  }

  // 2. Resolve Master Relations by ID or Name
  const [department, designation, employmentType, employmentStatus] = await Promise.all([
    findMasterRecord(prisma.department, rawDept),
    findMasterRecord(prisma.designation, rawDesig),
    findMasterRecord(prisma.employmentType, rawType),
    findMasterRecord(prisma.employmentStatus, rawStatus),
  ]);

  if (!department) throw new Error(`Department '${rawDept}' not found`);
  if (!designation) throw new Error(`Designation '${rawDesig}' not found`);
  if (!employmentType) throw new Error(`Employment Type '${rawType}' not found`);
  if (!employmentStatus) throw new Error(`Employment Status '${rawStatus}' not found`);

  // 3. Resolve Reporting Manager if provided
  let resolvedManagerId: string | null = null;
  if (rawManagerId) {
    const manager = await prisma.employee.findFirst({
      where: {
        OR: [
          { id: rawManagerId },
          { employeeId: rawManagerId },
          { email: rawManagerId },
        ],
      },
    });
    if (!manager) throw new Error(`Reporting manager '${rawManagerId}' not found`);
    resolvedManagerId = manager.id;
  }

  // 4. Safely parse joining date
  let joiningDate = new Date();
  if (rawJoiningDate) {
    const parsedDate = new Date(rawJoiningDate);
    if (!isNaN(parsedDate.getTime())) {
      joiningDate = parsedDate;
    }
  }

  // 5. Optional linked User account creation
  const shouldCreateUserAccount =
    createUserAccount === true ||
    createUserAccount === "true" ||
    createUserAccount === "1" ||
    Boolean(password);

  let createdUserId: string | null = null;
  if (shouldCreateUserAccount) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      createdUserId = existingUser.id;
    } else {
      const hashedPassword = await bcrypt.hash(password || "Employee@123", 12);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.EMPLOYEE,
        },
      });
      createdUserId = newUser.id;
    }
  }

  // 6. Auto Generate Employee ID (EMP-YYYY-XXXX)
  const employeeId = await generateEmployeeId();

  // 7. Create Employee record in Prisma
  const employee = await prisma.employee.create({
    data: {
      employeeId,
      name,
      email,
      phone: phone || null,
      photo: photoUrl || null,
      departmentId: department.id,
      designationId: designation.id,
      employmentTypeId: employmentType.id,
      employmentStatusId: employmentStatus.id,
      joiningDate,
      managerId: resolvedManagerId,
      hrNotes: hrNotes || null,
      userId: createdUserId,
    },
    include: {
      department: true,
      designation: true,
      employmentType: true,
      employmentStatus: true,
      manager: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          avatar: true,
        },
      },
    },
  });

  return employee;
};

export const getAllEmployees = async (query: EmployeeQuery) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const {
    search,
    departmentId,
    designationId,
    employmentStatusId,
    employmentTypeId,
    sortBy,
    sortOrder,
  } = query;

  const whereConditions: Prisma.EmployeeWhereInput[] = [];

  if (search && search.trim()) {
    const searchTerm = search.trim();
    whereConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { employeeId: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (departmentId && departmentId.trim()) whereConditions.push({ departmentId: departmentId.trim() });
  if (designationId && designationId.trim()) whereConditions.push({ designationId: designationId.trim() });
  if (employmentStatusId && employmentStatusId.trim()) whereConditions.push({ employmentStatusId: employmentStatusId.trim() });
  if (employmentTypeId && employmentTypeId.trim()) whereConditions.push({ employmentTypeId: employmentTypeId.trim() });

  const where: Prisma.EmployeeWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  const validSortFields = ["name", "joiningDate", "createdAt", "employeeId"];
  const sortField = validSortFields.includes(sortBy || "") ? (sortBy as string) : "createdAt";
  const order = sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortField]: order },
      include: {
        department: true,
        designation: true,
        employmentType: true,
        employmentStatus: true,
        manager: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            photo: true,
          },
        },
      },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: employees,
  };
};

export const getEmployeeById = async (id: string) => {
  const cleanId = sanitizeInput(id);
  if (!cleanId) throw new Error("Employee ID is required");

  await ensureEmployeeLeaveBalances(cleanId);

  const employee = await prisma.employee.findUnique({
    where: { id: cleanId },
    include: {
      department: true,
      designation: true,
      employmentType: true,
      employmentStatus: true,
      manager: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      subordinates: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          avatar: true,
        },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
      leaveBalances: {
        where: { year: new Date().getFullYear() },
        include: { leaveType: true },
        orderBy: { createdAt: "asc" },
      },
      leaveApplications: {
        include: { leaveType: true },
        orderBy: { appliedAt: "desc" },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee not found");
  }

  return employee;
};

export const getEmployeeSelfProfile = async (userId: string, userEmail: string) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
    include: {
      department: true,
      designation: true,
      employmentType: true,
      employmentStatus: true,
      manager: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found for this account");
  }

  // Hide internal HR notes for staff self-view
  const { hrNotes, ...employeeProfile } = employee;
  return employeeProfile;
};

export const updateEmployeeSelfProfile = async (
  userId: string,
  userEmail: string,
  payload: { name?: string; email?: string; phone?: string },
  photoUrl?: string
) => {
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ userId }, { email: userEmail }],
    },
  });

  if (!employee) {
    throw new Error("Employee profile not found");
  }

  const updateData: Prisma.EmployeeUpdateInput = {};

  const cleanName = sanitizeInput(payload.name);
  if (cleanName) {
    updateData.name = cleanName;
  }

  const cleanEmail = sanitizeInput(payload.email);
  if (cleanEmail && cleanEmail.toLowerCase() !== employee.email.toLowerCase()) {
    const duplicate = await prisma.employee.findUnique({
      where: { email: cleanEmail.toLowerCase() },
    });
    if (duplicate) {
      throw new Error("An employee with this email already exists");
    }
    updateData.email = cleanEmail.toLowerCase();
  }

  if (payload.phone !== undefined) {
    updateData.phone = sanitizeInput(payload.phone);
  }

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const updated = await prisma.employee.update({
    where: { id: employee.id },
    data: updateData,
    include: {
      department: true,
      designation: true,
      employmentType: true,
      employmentStatus: true,
      manager: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      documents: {
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  // Sync linked User account name/email if user account exists
  if (cleanName || (cleanEmail && cleanEmail.toLowerCase() !== employee.email.toLowerCase())) {
    const userUpdate: Record<string, unknown> = {};
    if (cleanName) userUpdate.name = cleanName;
    if (cleanEmail) userUpdate.email = cleanEmail.toLowerCase();

    await prisma.user.updateMany({
      where: {
        OR: [
          ...(employee.userId ? [{ id: employee.userId }] : []),
          { email: employee.email },
        ],
      },
      data: userUpdate,
    });
  }

  const { hrNotes, ...employeeProfile } = updated;
  return employeeProfile;
};

export const updateEmployee = async (
  id: string,
  payload: UpdateEmployeePayload,
  photoUrl?: string
) => {
  const cleanId = sanitizeInput(id);
  if (!cleanId) throw new Error("Employee ID is required");

  const existing = await prisma.employee.findUnique({ where: { id: cleanId } });
  if (!existing) {
    throw new Error("Employee not found");
  }

  const cleanEmail = sanitizeInput(payload.email);
  if (cleanEmail && cleanEmail !== existing.email) {
    const duplicate = await prisma.employee.findUnique({ where: { email: cleanEmail } });
    if (duplicate) {
      throw new Error("Another employee with this email already exists");
    }
  }

  const {
    departmentId,
    designationId,
    employmentTypeId,
    employmentStatusId,
    managerId,
    joiningDate,
  } = payload;

  const updateData: Prisma.EmployeeUpdateInput = {};

  if (payload.name) updateData.name = sanitizeInput(payload.name)!;
  if (cleanEmail) updateData.email = cleanEmail;
  if (payload.phone !== undefined) updateData.phone = sanitizeInput(payload.phone);
  if (payload.hrNotes !== undefined) updateData.hrNotes = sanitizeInput(payload.hrNotes);

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const rawJoiningDate = sanitizeInput(joiningDate);
  if (rawJoiningDate) {
    const parsed = new Date(rawJoiningDate);
    if (!isNaN(parsed.getTime())) {
      updateData.joiningDate = parsed;
    }
  }

  // Master relation updates
  const cleanDept = sanitizeInput(departmentId);
  if (cleanDept) {
    const dept = await findMasterRecord(prisma.department, cleanDept);
    if (!dept) throw new Error(`Department '${cleanDept}' not found`);
    updateData.department = { connect: { id: dept.id } };
  }

  const cleanDesig = sanitizeInput(designationId);
  if (cleanDesig) {
    const desig = await findMasterRecord(prisma.designation, cleanDesig);
    if (!desig) throw new Error(`Designation '${cleanDesig}' not found`);
    updateData.designation = { connect: { id: desig.id } };
  }

  const cleanType = sanitizeInput(employmentTypeId);
  if (cleanType) {
    const empType = await findMasterRecord(prisma.employmentType, cleanType);
    if (!empType) throw new Error(`Employment Type '${cleanType}' not found`);
    updateData.employmentType = { connect: { id: empType.id } };
  }

  const cleanStatus = sanitizeInput(employmentStatusId);
  if (cleanStatus) {
    const empStatus = await findMasterRecord(prisma.employmentStatus, cleanStatus);
    if (!empStatus) throw new Error(`Employment Status '${cleanStatus}' not found`);
    updateData.employmentStatus = { connect: { id: empStatus.id } };

    // Synchronize linked User account status: Active -> ACTIVE, Inactive -> INACTIVE
    const isInactiveStatus = empStatus.name.toLowerCase() === "inactive";
    const userStatusToSet = isInactiveStatus ? "INACTIVE" : "ACTIVE";

    await prisma.user.updateMany({
      where: {
        OR: [
          ...(existing.userId ? [{ id: existing.userId }] : []),
          { email: existing.email.toLowerCase() },
        ],
      },
      data: {
        status: userStatusToSet,
      },
    });
  }

  const cleanManagerId = sanitizeInput(managerId);
  if (managerId !== undefined) {
    if (cleanManagerId) {
      const manager = await prisma.employee.findFirst({
        where: {
          OR: [
            { id: cleanManagerId },
            { employeeId: cleanManagerId },
            { email: cleanManagerId },
          ],
        },
      });
      if (!manager) throw new Error(`Reporting manager '${cleanManagerId}' not found`);
      updateData.manager = { connect: { id: manager.id } };
    } else {
      updateData.manager = { disconnect: true };
    }
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id: cleanId },
    data: updateData,
    include: {
      department: true,
      designation: true,
      employmentType: true,
      employmentStatus: true,
      manager: {
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          photo: true,
        },
      },
    },
  });

  return updatedEmployee;
};

export const deleteEmployee = async (id: string) => {
  const cleanId = sanitizeInput(id);
  if (!cleanId) throw new Error("Employee ID is required");

  const existing = await prisma.employee.findUnique({ where: { id: cleanId } });
  if (!existing) {
    throw new Error("Employee not found");
  }

  return await prisma.employee.delete({
    where: { id: cleanId },
  });
};
