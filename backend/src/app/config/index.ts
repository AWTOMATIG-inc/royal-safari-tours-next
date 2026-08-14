interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT),
  dbUrl: process.env.DB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
  nodeEnv: process.env.NODE_ENV as string,
};

export default config;
