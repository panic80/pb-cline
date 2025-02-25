module.exports = {
  apps: [
    {
      name: 'main-server',
      script: './server/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'proxy-server',
      script: './server/proxy.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'root',
      host: '46.202.177.230',
      path: '/var/www/32cbgg8.com',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.cjs --env production'
    }
  }
};
