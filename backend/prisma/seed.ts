import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.DB_URI;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting HRM Master Database Seeding...");

  // 1. Seed Super Admin Account
  const adminEmail = "admin@gmail.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    const adminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });
    console.log(`✓ Super Admin created: ${adminUser.email}`);
  } else {
    console.log(`✓ Super Admin already exists: ${existingUser.email}`);
  }

  // 2. Seed Departments
  const departments = [
    { name: "Executive", description: "Executive Board & C-Level Management" },
    { name: "Human Resources", description: "Talent Acquisition, Employee Welfare & HR Operations" },
    { name: "Finance & Accounts", description: "Financial Management, Payroll & Corporate Accounting" },
    { name: "Operations & Safaris", description: "Tour Operations, Ground Transport & Safari Management" },
    { name: "Marketing & Sales", description: "Digital Marketing, Lead Generation & Sales Growth" },
    { name: "Customer Support", description: "24/7 Client Support & Booking Assistance" },
    { name: "Information Technology", description: "IT Infrastructure, Software Engineering & Systems" },
  ];

  console.log("\n📂 Seeding Departments...");
  for (const dept of departments) {
    const created = await prisma.department.upsert({
      where: { name: dept.name },
      update: { description: dept.description },
      create: dept,
    });
    console.log(`   ✓ Department: ${created.name}`);
  }

  // 3. Seed Designations
  const designations = [
    { name: "Managing Director", description: "Executive Director" },
    { name: "HR Manager", description: "Lead Human Resources Specialist" },
    { name: "Senior Safari Guide", description: "Lead Expedition & Wilderness Guide" },
    { name: "Accountant", description: "Senior Financial Accountant" },
    { name: "Travel Consultant", description: "Bespoke Tour Package Planner" },
    { name: "Software Engineer", description: "Full-Stack Web & Systems Developer" },
    { name: "Support Executive", description: "Customer Care & Desk Executive" },
  ];

  console.log("\n🏷️ Seeding Designations...");
  for (const desig of designations) {
    const created = await prisma.designation.upsert({
      where: { name: desig.name },
      update: { description: desig.description },
      create: desig,
    });
    console.log(`   ✓ Designation: ${created.name}`);
  }

  // 4. Seed Employment Types
  const employmentTypes = [
    "Full-Time",
    "Part-Time",
    "Contractual",
    "Internship",
    "Trainee",
  ];

  console.log("\n📋 Seeding Employment Types...");
  for (const name of employmentTypes) {
    const created = await prisma.employmentType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`   ✓ Employment Type: ${created.name}`);
  }

  // 5. Seed Employment Statuses
  const employmentStatuses = [
    "Active",
    "Inactive",
  ];

  console.log("\n⚡ Seeding Employment Statuses...");
  for (const name of employmentStatuses) {
    const created = await prisma.employmentStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`   ✓ Employment Status: ${created.name}`);
  }

  console.log("\n🎉 All HRM Master Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during HRM database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
