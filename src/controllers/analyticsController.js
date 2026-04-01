const Analytics = require('../models/Analytics');

// Get analytics overview (aggregate stats for dashboard)
exports.getOverview = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({ date: { $gte: startDate } }).sort({ date: 1 });

    // Calculate totals
    const totals = analytics.reduce(
      (acc, day) => ({
        views: acc.views + day.views,
        clicks: acc.clicks + day.clicks,
        totalSessionTime: acc.totalSessionTime + day.totalSessionTime,
        sessionCount: acc.sessionCount + day.sessionCount,
        bounces: acc.bounces + day.bounces,
        uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors
      }),
      { views: 0, clicks: 0, totalSessionTime: 0, sessionCount: 0, bounces: 0, uniqueVisitors: 0 }
    );

    // Calculate averages
    const avgSessionTime = totals.sessionCount > 0
      ? Math.round(totals.totalSessionTime / totals.sessionCount)
      : 0;
    const bounceRate = totals.sessionCount > 0
      ? Math.round((totals.bounces / totals.sessionCount) * 100)
      : 0;

    // Calculate percentage changes from previous period
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const prevAnalytics = await Analytics.find({
      date: { $gte: prevStartDate, $lt: startDate }
    });

    const prevTotals = prevAnalytics.reduce(
      (acc, day) => ({
        views: acc.views + day.views,
        clicks: acc.clicks + day.clicks,
        totalSessionTime: acc.totalSessionTime + day.totalSessionTime,
        sessionCount: acc.sessionCount + day.sessionCount,
        bounces: acc.bounces + day.bounces
      }),
      { views: 0, clicks: 0, totalSessionTime: 0, sessionCount: 0, bounces: 0 }
    );

    const calcChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const prevAvgSession = prevTotals.sessionCount > 0
      ? Math.round(prevTotals.totalSessionTime / prevTotals.sessionCount)
      : 0;
    const prevBounceRate = prevTotals.sessionCount > 0
      ? Math.round((prevTotals.bounces / prevTotals.sessionCount) * 100)
      : 0;

    res.json({
      overview: {
        views: totals.views,
        viewsChange: calcChange(totals.views, prevTotals.views),
        clicks: totals.clicks,
        clicksChange: calcChange(totals.clicks, prevTotals.clicks),
        avgSessionTime,
        avgSessionTimeChange: calcChange(avgSessionTime, prevAvgSession),
        bounceRate,
        bounceRateChange: calcChange(prevBounceRate, bounceRate) * -1, // Invert: lower is better
        uniqueVisitors: totals.uniqueVisitors
      },
      period: days,
      analytics
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record a page view
exports.recordView = async (req, res) => {
  try {
    const { path } = req.body;
    const record = await Analytics.getToday();
    await record.incrementViews(path || '/');
    res.json({ success: true, views: record.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record a click
exports.recordClick = async (req, res) => {
  try {
    const record = await Analytics.getToday();
    await record.incrementClicks();
    res.json({ success: true, clicks: record.clicks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record session end
exports.recordSession = async (req, res) => {
  try {
    const { sessionTime, isBounce } = req.body;
    const record = await Analytics.getToday();
    await record.trackSession(sessionTime || 0, isBounce || false);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get analytics history
exports.getHistory = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({ date: { $gte: startDate } }).sort({ date: 1 });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get today's stats
exports.getToday = async (req, res) => {
  try {
    const record = await Analytics.getToday();
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Seed initial data (for testing)
exports.seedData = async (req, res) => {
  try {
    const days = 30;
    const analytics = [];

    // Generate data for the past 'days'
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Random data for demo
      const views = Math.floor(Math.random() * 200) + 50;
      const clicks = Math.floor(Math.random() * 30) + 10;
      const sessionCount = Math.floor(views * 0.7);
      const sessionTime = Math.floor(Math.random() * 180) + 60; // 1-4 minutes
      const bounces = Math.floor(sessionCount * (Math.random() * 0.3 + 0.2)); // 20-50% bounce

      analytics.push({
        date,
        views,
        clicks,
        totalSessionTime: sessionTime * sessionCount,
        sessionCount,
        bounces,
        uniqueVisitors: Math.floor(views * 0.6),
        sources: {
          direct: Math.floor(Math.random() * 30) + 10,
          google: Math.floor(Math.random() * 40) + 20,
          facebook: Math.floor(Math.random() * 20) + 5,
          twitter: Math.floor(Math.random() * 10) + 2,
          linkedin: Math.floor(Math.random() * 10) + 2,
          other: Math.floor(Math.random() * 15) + 5
        }
      });
    }

    // Clear old data and insert new
    await Analytics.deleteMany({});
    await Analytics.insertMany(analytics);

    res.json({ message: 'Seed data created', count: analytics.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};