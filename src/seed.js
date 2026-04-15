const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#0A2463' },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Partner = mongoose.model('Partner', partnerSchema);

const defaultPartners = [
  { name: 'First Bank', color: '#FF6900', order: 1 },
  { name: 'GTBank', color: '#1D3E7E', order: 2 },
  { name: 'Zenith Bank', color: '#E31E24', order: 3 },
  { name: 'Nigerian Navy', color: '#1A365D', order: 4 },
  { name: 'Nigerian Army', color: '#22543D', order: 5 },
  { name: 'NCC', color: '#2D3748', order: 6 },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/swiftpro';
  await mongoose.connect(mongoUri);
  
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const admin = new User({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@swiftpro.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
  
  const partnersCount = await Partner.countDocuments();
  if (partnersCount === 0) {
    await Partner.insertMany(defaultPartners);
    console.log('Default partners created');
  } else {
    console.log('Partners already exist');
  }
  
  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
