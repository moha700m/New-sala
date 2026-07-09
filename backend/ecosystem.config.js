/**
 * Alternative to Docker: run directly on the VPS with PM2.
 * Usage:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save && pm2 startup   (so it restarts on server reboot)
 */
module.exports = {
  apps: [
    {
      name: "agent-souq-payments",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env_production: {
        NODE_ENV: "production",
      },
      max_memory_restart: "300M",
    },
  ],
};
