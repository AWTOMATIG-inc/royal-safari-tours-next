module.exports = {
  apps: [
    {
      name: "royal-safari-frontend",
      cwd: "/home/khalidh/royal-safari-tours-next/frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3006,
      },
    },
    {
      name: "royal-safari-backend",
      cwd: "/home/khalidh/royal-safari-tours-next/backend",
      script: "dist/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
  ],
};