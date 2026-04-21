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

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'code' },
  category: { type: String, enum: ['infrastructure', 'development', 'security', 'consulting'], default: 'development' },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Partner = mongoose.model('Partner', partnerSchema);
const Service = mongoose.model('Service', serviceSchema);

const defaultPartners = [
  { name: 'Finance', color: '#1D3E7E', order: 1 },
  { name: 'Healthcare', color: '#22543D', order: 2 },
  { name: 'Government', color: '#1A365D', order: 3 },
  { name: 'Telecoms', color: '#2D3748', order: 4 },
  { name: 'Retail', color: '#B45309', order: 5 },
  { name: 'Logistics', color: '#6D28D9', order: 6 },
];

const defaultServices = [
  {
    title: 'IT Infrastructure',
    description: 'Robust and scalable IT infrastructure solutions for modern businesses.',
    icon: 'Server',
    category: 'infrastructure',
    features: ['Network Design', 'Server Virtualization', 'Data Center Solutions', 'Infrastructure Monitoring'],
    order: 1
  },
  {
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business requirements.',
    icon: 'Code',
    category: 'development',
    features: ['Web Applications', 'Mobile Apps', 'Enterprise Software', 'API Development'],
    order: 2
  },
  {
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your digital assets.',
    icon: 'Shield',
    category: 'security',
    features: ['Vulnerability Assessment', 'Penetration Testing', 'Security Audits', 'Incident Response'],
    order: 3
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud services for modern business operations.',
    icon: 'Cloud',
    category: 'infrastructure',
    features: ['Cloud Migration', 'AWS/Azure/Google', 'Hybrid Cloud', 'Cloud Security'],
    order: 4
  },
  {
    title: 'IT Consulting',
    description: 'Strategic IT guidance to drive business transformation.',
    icon: 'Briefcase',
    category: 'consulting',
    features: ['Digital Transformation', 'IT Strategy', 'Technology Assessment', 'Process Optimization'],
    order: 5
  },
  {
    title: 'Managed IT Support',
    description: 'Reliable managed IT services to keep your business running smoothly.',
    icon: 'Headphones',
    category: 'consulting',
    features: ['24/7 Help Desk', 'Proactive Monitoring', 'System Maintenance', 'Remote Support'],
    order: 6
  },
];

async function seed() {
  const mongoUri = 'mongodb+srv://swiftpro:xbvHSWsJWpwWLVtn@cluster0.t3zgzzu.mongodb.net/Swiftpro';
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
  
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    await Service.insertMany(defaultServices);
    console.log('Default services created');
  } else {
    console.log('Services already exist');
  }
  
  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
