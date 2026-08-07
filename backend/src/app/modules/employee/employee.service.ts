import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../utils/prisma";

// Helper function to generate unique employee ID (e.g. EMP-2026-0001)
export const generateEmployeeId = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `EMP-${currentYear}-`;

  const count = await prisma.employee.count({
    where: {
      employeeId: {
        startsWith: prefix,
      },
    },
  });

  const sequence = count + 1;
  const formattedSequence = String(sequence).padStart(4, "0");
  return `${prefix}${formattedSequence}`;
};

export const createEmployee = async (
  payload: any,
  photoUrl?: string
) => {
  const {
    name,
    email,
    phone,
    departmentId,
    designationId,
    employmentTypeId,
    employmentStatusId,
    joiningDate,
    managerId,
    hrNotes,
    createUserAccount,
    password,
  } = payload;

  // 1. Check duplicate email in Employee table
  const existingEmployee = await prisma.employee.findUnique({
    where: { email },
  });
  if (existingEmployee) {
    throw new Error("Employee with this email already exists");
  }

  // 2. Verify foreign keys
  const [department, designation, employmentType, employmentStatus] = await Promise.all([
    prisma.department.findUnique({ where: { id: departmentId } }),
    prisma.designation.findUnique({ where: { id: designationId } }),
    prisma.employmentType.findUnique({ where: { id: employmentTypeId } }),
    prisma.employmentStatus.findUnique({ where: { id: employmentStatusId } }),
  ]);

  if (!department) throw new Error("Department not found");
  if (!designation) throw new Error("Designation not found");
  if (!employmentType) throw new Error("Employment Type not found");
  if (!employmentStatus) throw new Error("Employment Status not found");

  if (managerId) {
    const manager = await prisma.employee.findUnique({ where: { id: managerId } });
    if (!manager) throw new Error("Manager not found");
  }

  // 3. Optional linked User account creation
  let createdUserId: string | null = null;
  if (createUserAccount || password) {
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

  // 4. Auto Generate Employee ID
  const employeeId = await generateEmployeeId();

  // 5. Create Employee record
  const employee = await prisma.employee.create({
    data: {
      employeeId,
      name,
      email,
      phone,
      photo: photoUrl || null,
      departmentId,
      designationId,
      employmentTypeId,
      employmentStatusId,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      managerId: managerId || null,
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

export const getAllEmployees = async (query: {
  search?: string;
  departmentId?: string;
  designationId?: string;
  employmentStatusId?: string;
  employmentTypeId?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, departmentId, designationId, employmentStatusId, employmentTypeId, sortBy, sortOrder } = query;

  const whereConditions: Prisma.EmployeeWhereInput[] = [];

  if (search) {
    whereConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (departmentId) {
    whereConditions.push({ departmentId });
  }

  if (designationId) {
    whereConditions.push({ designationId });
  }

  if (employmentStatusId) {
    whereConditions.push({ employmentStatusId });
  }

  if (employmentTypeId) {
    whereConditions.push({ employmentTypeId });
  }

  const where: Prisma.EmployeeWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

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
  const employee = await prisma.employee.findUnique({
    where: { id },
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

  // Remove hrNotes for employee self-profile view
  const { hrNotes, ...employeeProfile } = employee;
  return employeeProfile;
};

export const updateEmployee = async (
  id: string,
  payload: any,
  photoUrl?: string
) => {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Employee not found");
  }

  if (payload.email && payload.email !== existing.email) {
    const duplicate = await prisma.employee.findUnique({ where: { email: payload.email } });
    if (duplicate) {
      throw new Error("Another employee with this email already exists");
    }
  }

  const updateData: Prisma.EmployeeUpdateInput = { ...payload };

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  if (payload.joiningDate) {
    updateData.joiningDate = new Date(payload.joiningDate);
  }

  // Master relation updates
  if (payload.departmentId) {
    updateData.department = { connect: { id: payload.departmentId } };
    delete (updateData as any).departmentId;
  }

  if (payload.designationId) {
    updateData.designation = { connect: { id: payload.designationId } };
    delete (updateData as any).designationId;
  }

  if (payload.employmentTypeId) {
    updateData.employmentType = { connect: { id: payload.employmentTypeId } };
    delete (updateData as any).employmentTypeId;
  }

  if (payload.employmentStatusId) {
    updateData.employmentStatus = { connect: { id: payload.employmentStatusId } };
    delete (updateData as any).employmentStatusId;
  }

  if (payload.managerId !== undefined) {
    if (payload.managerId) {
      updateData.manager = { connect: { id: payload.managerId } };
    } else {
      updateData.manager = { disconnect: true };
    }
    delete (updateData as any).managerId;
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id },
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
        },
      },
    },
  });

  return updatedEmployee;
};

export const deleteEmployee = async (id: string) => {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Employee not found");
  }

  return await prisma.employee.delete({
    where: { id },
  });
};
