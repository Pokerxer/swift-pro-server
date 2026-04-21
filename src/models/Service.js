const mongoose = require('mongoose');

const processStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, default: '' },       // legacy / short description
  shortDescription: { type: String, default: '' },
  fullDescription: { type: String, default: '' },
  icon: { type: String, default: 'Server' },
  category: {
    type: String,
    enum: ['infrastructure', 'development', 'security', 'consulting'],
    default: 'development',
  },
  features: [{ type: String }],
  processSteps: [processStepSchema],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  pricing: { type: String, default: '' },
  deliveryTime: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);
