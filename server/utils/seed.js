require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Record = require('../models/Record');
const {
  ROLES,
  VERIFICATION_STATUSES,
  VERIFICATION_TYPES,
  COMPANIES,
  ACCESS_LEVELS,
} = require('../config/constants');

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Sai', 'Arjun', 'Reyansh', 'Ayaan', 'Krishna',
  'Ishaan', 'Shaurya', 'Priya', 'Ananya', 'Diya', 'Saanvi', 'Aanya', 'Aarohi',
  'Meera', 'Kavya', 'Riya', 'Pooja', 'Rahul', 'Amit', 'Vikram', 'Rohan',
  'Neha', 'Sneha', 'Karan', 'Manish', 'Deepak', 'Suresh',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehta', 'Joshi',
  'Reddy', 'Nair', 'Iyer', 'Chopra', 'Malhotra', 'Kapoor', 'Banerjee',
  'Das', 'Mukherjee', 'Chauhan', 'Yadav', 'Thakur',
];

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomDate = (daysBack = 180) => {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee-verification';

  try {
    await mongoose.connect(uri);
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Record.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    // Seed demo users
    const users = await User.create([
      {
        email: 'admin@demo.com',
        password: 'Admin@123',
        name: 'Admin User',
        role: ROLES.ADMIN,
        isActive: true,
      },
      {
        email: 'user@demo.com',
        password: 'User@123',
        name: 'General User',
        role: ROLES.GENERAL_USER,
        isActive: true,
      },
      {
        email: 'manager@demo.com',
        password: 'Manager@123',
        name: 'HR Manager',
        role: ROLES.ADMIN,
        isActive: true,
      },
      {
        email: 'viewer@demo.com',
        password: 'Viewer@123',
        name: 'Viewer Account',
        role: ROLES.GENERAL_USER,
        isActive: false,
      },
    ]);
    console.log(`👤 Seeded ${users.length} users`);

    // Seed verification records
    const records = [];
    for (let i = 0; i < 60; i++) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      records.push({
        employeeName: `${firstName} ${lastName}`,
        company: randomElement(COMPANIES),
        verificationType: randomElement(VERIFICATION_TYPES),
        status: randomElement(VERIFICATION_STATUSES),
        submittedDate: randomDate(),
        accessLevel: randomElement(ACCESS_LEVELS),
        notes: Math.random() > 0.5
          ? `Verification initiated for ${firstName} ${lastName}`
          : '',
      });
    }

    await Record.insertMany(records);
    console.log(`📋 Seeded ${records.length} verification records`);

    console.log('\n✅ Database seeding complete!');
    console.log('──────────────────────────────');
    console.log('Demo credentials:');
    console.log('  Admin:  admin@demo.com / Admin@123');
    console.log('  User:   user@demo.com / User@123');
    console.log('──────────────────────────────\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
