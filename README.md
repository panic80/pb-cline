# Policy Assistant Deployment Instructions

This document summarizes the steps and fixes required to deploy the Policy Assistant application to a Hostinger VPS with domain **32cbgg8.com**.

## Overview
This guide covers the following:
- Setting up the VPS environment
- Building and deploying the React application using Vite
- Configuring PM2 and Nginx
- Managing environment variables (.env)
- Git workflow and committing production fixes

## Prerequisites
- Hostinger VPS (IP: 46.202.177.230)
- Domain 32cbgg8.com configured with A records pointing to your VPS
- Node.js, Git, and PM2 installed on the VPS
- Nginx installed and managed via Certbot for SSL

## Deployment Steps

### 1. VPS Setup and Environment Configuration
- **SSH into VPS:**  
  ```bash
  ssh root@46.202.177.230
  ```
- **Environment Variables:**  
  Create a `.env` file in your deployment directory (e.g., `/var/www/pb-cline`) with your Gemini API key:
  ```env
  GEMINI_API_KEY=your_gemini_api_key
  ```
  *Note:* Do not push secrets to Git. This file should remain secure on the VPS.

### 2. Building the Application
- From your project root, run:
  ```bash
  npm run build
  ```
  This will generate a production-ready build in the `dist` folder.

### 3. Configuring the Web Server

#### Option A: Using a Node Backend (Proxy Pass)
- **PM2 Process Management:**  
  Ensure your Node server (e.g., an Express server) serves the production build and is configured to listen on port **3000**.
- **Nginx Configuration:**  
  The current configuration in `/etc/nginx/sites-available/32cbgg8.com` uses:
  ```nginx
  proxy_pass http://localhost:3000;
  ```
  to route HTTPS requests to your Node server.

#### Option B: Serving Static Files Directly
- If you prefer Nginx to serve the static files directly from the `dist` folder, update your Nginx configuration as follows:
  ```nginx
  server {
      listen 443 ssl;
      server_name 32cbgg8.com www.32cbgg8.com;

      root /var/www/pb-cline/dist;
      index index.html;

      location / {
          try_files $uri $uri/ /index.html;
      }

      ssl_certificate /etc/letsencrypt/live/32cbgg8.com/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/32cbgg8.com/privkey.pem;
      include /etc/letsencrypt/options-ssl-nginx.conf;
      ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
  }
  ```
- Reload Nginx:
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

### 4. Git Workflow for Production Fixes
- If you work directly on the VPS and need to push changes, use the following commands:
  ```bash
  git add .
  git commit -m "Fixed Version"
  git push origin main
  ```
- *Note:* It is best practice to make changes in your local environment and then push them. However, production hotfixes can be committed directly when necessary.

### 5. Restarting the Application
- **After Environment Variable Updates or Deployments:**  
  Restart your Node server using PM2:
  ```bash
  pm2 restart ecosystem.config.cjs
  ```

## Fixes and Troubleshooting
- **Duplicate Component Declaration:**  
  In `src/App.jsx`, ensure that the `LandingPage` component is imported only once. Remove any duplicate lazy import statements.
- **502 Bad Gateway Errors:**  
  Verify that your Node server is running on the correct port (e.g., test with `curl http://localhost:3000`) and that Nginx is correctly forwarding requests.
- **Serving the Correct Build:**  
  Remember that when using tools like `curl`, you might see the static `index.html` content. Test your application in a browser to ensure proper rendering.

## Summary
By following these steps:
- Your VPS environment is correctly configured and secured.
- The production build of the Policy Assistant app is generated and served.
- Nginx properly routes HTTPS requests, either by proxying to your Node server or serving static files directly.
- PM2 manages your Node processes.
- Git is used to track and commit production fixes.

This completes the deployment and configuration process for the Policy Assistant application.

---
*Last updated: 2/18/2025*
