// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars first
dotenv.config();

// DB connection
const connectDB = require('./config/database');
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON and form bodies BEFORE routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Root + health checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Research Management System API is running',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Optional: debug body route (helpful to confirm JSON is received)
app.post('/api/_debug/body', (req, res) => {
  res.json({ gotBody: !!req.body, body: req.body, headers: req.headers });
});

// Routes (require once so startup fails fast if a route file has an error)
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
let userRoutes = null;
try {
  // Only mount if the file exists in your project
  userRoutes = require('./routes/users');
} catch (_) {
  // no users route file; ignore
}
const commentRoutes = require('./routes/comments');

// Mount
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
if (userRoutes) app.use('/api/users', userRoutes);
app.use('/api', commentRoutes); // provides: /api/projects/:projectId/comments and /api/comments/:commentId

// 404 handler (keep after all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Central error handler (last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});