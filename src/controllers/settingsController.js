const connectDB = require('../db');
const Settings = require('../models/Settings');

exports.get = async (req, res) => {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await connectDB();
    const { phone, phoneRaw, whatsappMessage, address, emails } = req.body;

    if (emails !== undefined) {
      if (!Array.isArray(emails) || emails.filter(e => typeof e === 'string' && e.trim()).length === 0) {
        return res.status(400).json({ error: 'At least one email address is required' });
      }
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    if (phone !== undefined) settings.phone = phone;
    if (phoneRaw !== undefined) settings.phoneRaw = phoneRaw;
    if (whatsappMessage !== undefined) settings.whatsappMessage = whatsappMessage;
    if (address !== undefined) settings.address = address;
    if (emails !== undefined) settings.emails = emails.map(e => e.trim()).filter(Boolean);
    settings.updatedAt = new Date();

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
