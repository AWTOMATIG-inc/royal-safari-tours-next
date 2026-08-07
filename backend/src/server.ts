import app from './app';
import config from './app/config';
import { prisma } from './app/utils/prisma';

async function bootstrap() {
  try {
    // Attempt database connection
    await prisma.$connect();
    console.log("Database connection successful");

    app.listen(config.port, () => {
      console.log(`Server listening on port http://localhost:${config.port}`);
    });
  } catch (error: any) {
    console.error("Database connection failed:", error.message || error);
    process.exit(1);
  }
}

bootstrap();
