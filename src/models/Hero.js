const mongoose = require('mongoose');

const heroFeatureSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  label: { type: String, required: true }
});

const heroStatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true }
});

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  ctaPrimaryText: { type: String },
  ctaPrimaryLink: { type: String },
  ctaSecondaryText: { type: String },
  ctaSecondaryLink: { type: String },
  backgroundImage: { type: String },
  features: [heroFeatureSchema],
  stats: [heroStatSchema],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const heroSchema = new mongoose.Schema({
  slides: [heroSlideSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hero', heroSchema);