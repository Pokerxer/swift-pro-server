const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Daily aggregated data
  date: { type: Date, required: true, default: () => new Date().setHours(0, 0, 0, 0) },

  // Page views
  views: { type: Number, default: 0 },

  // Click tracking (CTA clicks, button clicks, etc.)
  clicks: { type: Number, default: 0 },

  // Session data (stored in seconds)
  totalSessionTime: { type: Number, default: 0 },
  sessionCount: { type: Number, default: 0 },

  // Bounce tracking (single page visits / total visits)
  bounces: { type: Number, default: 0 },

  // Unique visitors
  uniqueVisitors: { type: Number, default: 0 },

  // Traffic sources
  sources: {
    direct: { type: Number, default: 0 },
    google: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    twitter: { type: Number, default: 0 },
    linkedin: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },

  // Top pages viewed
  topPages: [{
    path: { type: String },
    views: { type: Number, default: 0 }
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient date-based queries
analyticsSchema.index({ date: 1 });

// Calculate average session time
analyticsSchema.virtual('averageSessionTime').get(function() {
  if (this.sessionCount === 0) return 0;
  return Math.round(this.totalSessionTime / this.sessionCount);
});

// Calculate bounce rate percentage
analyticsSchema.virtual('bounceRate').get(function() {
  if (this.sessionCount === 0) return 0;
  return Math.round((this.bounces / this.sessionCount) * 100);
});

// Static method to get or create today's record
analyticsSchema.statics.getToday = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let record = await this.findOne({ date: today });
  if (!record) {
    record = await this.create({ date: today });
  }
  return record;
};

// Method to increment views
analyticsSchema.methods.incrementViews = async function(path) {
  this.views += 1;

  // Track top pages
  const existingPage = this.topPages.find(p => p.path === path);
  if (existingPage) {
    existingPage.views += 1;
  } else {
    this.topPages.push({ path, views: 1 });
  }

  // Keep only top 10 pages
  this.topPages.sort((a, b) => b.views - a.views);
  this.topPages = this.topPages.slice(0, 10);

  this.updatedAt = new Date();
  return this.save();
};

// Method to increment clicks
analyticsSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  this.updatedAt = new Date();
  return this.save();
};

// Method to track session end
analyticsSchema.methods.trackSession = async function(sessionTime, isBounce) {
  this.totalSessionTime += sessionTime;
  this.sessionCount += 1;
  if (isBounce) {
    this.bounces += 1;
  }
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Analytics', analyticsSchema);