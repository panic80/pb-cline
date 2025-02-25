import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import nodemailer from 'nodemailer';
import { defaultTravelInstructions } from './travelData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API routes first with enhanced error handling
app.all('/api/travel-instructions*', (req, res) => {
  try {
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.json({
      content: defaultTravelInstructions,
      timestamp: new Date().toISOString()
    });
    console.log('Travel instructions API request served successfully');
  } catch (error) {
    console.error('Error serving travel instructions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve travel instructions'
    });
  }
});

// Serve the main landing page
app.use(express.static(path.join(__dirname, '../public_html')));

// Serve the React app under /chatbot path
app.use('/chatbot', express.static(path.join(__dirname, '../dist')));


/* Proxy setup for the backend server (for all /api requests except /api/travel-instructions) */
app.use('/api', createProxyMiddleware((pathname, req) => {
  return !pathname.startsWith('/api/travel-instructions');
}, {
    target: 'http://localhost:3001',
    changeOrigin: true,
}));

// Handle React app routes
app.get('/chatbot/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});


// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public_html/index.html'));
});

//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
