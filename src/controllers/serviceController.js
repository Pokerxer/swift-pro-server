const connectDB = require('../db');
const Model = require('../models/Service');

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

exports.getAll = async (req, res) => {
  try {
    await connectDB();
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    await connectDB();
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    await connectDB();
    const item = await Model.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    await connectDB();
    const body = { ...req.body };

    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Ensure slug is unique by appending a suffix if needed
    if (body.slug) {
      const existing = await Model.findOne({ slug: body.slug });
      if (existing) {
        body.slug = `${body.slug}-${Date.now()}`;
      }
    }

    // Keep description in sync with shortDescription for backwards compatibility
    if (body.shortDescription && !body.description) {
      body.description = body.shortDescription;
    }

    const item = new Model(body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await connectDB();
    const body = { ...req.body, updatedAt: new Date() };

    // Keep description in sync with shortDescription for backwards compatibility
    if (body.shortDescription && !body.description) {
      body.description = body.shortDescription;
    }

    const item = await Model.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await connectDB();
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
