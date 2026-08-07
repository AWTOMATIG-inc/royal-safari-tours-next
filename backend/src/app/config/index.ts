interface Config {
  port: number;
  dbUrl?: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  dbUrl: process.env.DATABASE_URL || process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET || "dsfsadf211sdfsad",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "dsfsadf211sdfsad_refresh_key",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};

export default config;
