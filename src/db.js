const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swiftpro';

let isConnected = false;

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected — will reconnect on next request');
});

mongoose.connection.on('error', () => {
  isConnected = false;
});

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

module.exports = connectDB;
