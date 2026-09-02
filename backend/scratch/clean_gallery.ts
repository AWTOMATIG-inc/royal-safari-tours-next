import "dotenv/config";
import { prisma } from "../src/app/utils/prisma";

async function clean() {
  try {
    await prisma.$executeRawUnsafe(`UPDATE "GalleryItem" SET "packageId" = NULL WHERE "packageId" IS NOT NULL;`);
    console.log("Successfully nullified orphan packageId in GalleryItem");
  } catch (err) {
    console.error("Clean error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
