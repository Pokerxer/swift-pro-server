require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');

const servicesRoutes = require('./routes/services');
const projectsRoutes = require('./routes/projects');
const postsRoutes = require('./routes/posts');
const teamRoutes = require('./routes/team');
const testimonialsRoutes = require('./routes/testimonials');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const heroRoutes = require('./routes/hero');
const analyticsRoutes = require('./routes/analytics');
const partnersRoutes = require('./routes/partners');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/partners', partnersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SwiftPro Backend API' });
});

const PORT = process.env.PORT || 5002;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();