interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  nodeEnv: string;
  gmailUser: string;
  gmailAppPassword: string;
  otpExpiryMinutes: number;
  otpMaxAttempts: number;
  redisUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT || 5000),
  dbUrl: (process.env.DB_URI || process.env.DATABASE_URL) as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
  nodeEnv: process.env.NODE_ENV as string,
  gmailUser: process.env.GMAIL_USER || process.env.EMAIL || "reservation.rst@gmail.com",
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || process.env.PASS || "",
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 5),
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS || 5),
  redisUrl: process.env.REDIS_URL || "",
};

export default config;
