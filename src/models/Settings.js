const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  phone: { type: String, default: '+234 805 795 5859' },
  phoneRaw: { type: String, default: '2348057955859' },
  whatsappMessage: { type: String, default: "Hello Swift Professional Solutions, I'd like to enquire about your services." },
  address: { type: String, default: 'House 12b Paradise Estate, Katampe, Abuja, Nigeria' },
  emails: { type: [String], default: ['Admin@Swiftpsl.com'] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
