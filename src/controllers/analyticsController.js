const connectDB = require('../db');
const Analytics = require('../models/Analytics');

exports.getOverview = async (req, res) => {
  try {
    await connectDB();
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const analytics = await Analytics.find({ date: { : startDate } });
    
    const overview = {
      views: analytics.reduce((sum, a) => sum + (a.views || 0), 0),
      clicks: analytics.reduce((sum, a) => sum + (a.clicks || 0), 0),
      avgSessionTime: analytics.length ? analytics.reduce((sum, a) => sum + (a.avgSessionTime || 0), 0) / analytics.length : 0,
      bounceRate: analytics.length ? analytics.reduce((sum, a) => sum + (a.bounceRate || 0), 0) / analytics.length : 0,
      viewsChange: 0,
      clicksChange: 0,
      avgSessionTimeChange: 0,
      bounceRateChange: 0
    };
    
    res.json({ data: { overview } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.track = async (req, res) => {
  try {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let analytics = await Analytics.findOne({ date: today });
    if (!analytics) {
      analytics = new Analytics({ date: today });
    }
    
    if (req.body.views) analytics.views = (analytics.views || 0) + req.body.views;
    if (req.body.clicks) analytics.clicks = (analytics.clicks || 0) + req.body.clicks;
    if (req.body.avgSessionTime) analytics.avgSessionTime = req.body.avgSessionTime;
    if (req.body.bounceRate) analytics.bounceRate = req.body.bounceRate;
    
    await analytics.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};