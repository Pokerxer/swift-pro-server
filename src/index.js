require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel serverless - don't start server, just export app
const PORT = process.env.PORT || 5000;

// Only connect to MongoDB and listen when not in serverless
if (process.env.VERCEL !== '1') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftpro';

  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;