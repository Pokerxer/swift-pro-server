const connectDB = require('../db');
const Hero = require('../models/Hero');

exports.get = async (req, res) => {
  try {
    await connectDB();
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({ slides: [] });
      await hero.save();
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await connectDB();
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      hero.slides = req.body.slides || hero.slides;
    }
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};