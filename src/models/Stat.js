const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  suffix: { type: String },
  prefix: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stat', statSchema);