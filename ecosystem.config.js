module.exports = {
  apps: [
    {
      name: "royal-safari-frontend",
      cwd: "/home/khalidh/royal-safari-tours-next/frontend",
      script: "npm",
      args: "start -- -p 3006",
    },
    {
      name: "royal-safari-backend",
      cwd: "/home/khalidh/royal-safari-tours-next/backend",
      script: "npm",
      args: "start -- -p 5001",
    },
  ],
};