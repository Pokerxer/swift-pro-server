const Hero = require('../models/Hero');

exports.get = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ slides: [] });
    }
    res.json(hero.slides.filter(s => s.isActive).sort((a, b) => a.order - b.order));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { slides } = req.body;
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({ slides });
    } else {
      hero.slides = slides;
    }
    hero.updatedAt = new Date();
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};