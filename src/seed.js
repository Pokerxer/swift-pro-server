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

const User = mongoose.model('User', userSchema);

async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/swiftpro';
  await mongoose.connect(mongoUri);
  
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists');
    process.exit(0);
  }
  
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const admin = new User({
    username: process.env.ADMIN_USERNAME || 'admin',
    email: process.env.ADMIN_EMAIL || 'admin@swiftpro.com',
    password: hashedPassword,
    role: 'admin'
  });
  
  await admin.save();
  console.log('Admin user created successfully');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
