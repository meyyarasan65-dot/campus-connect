import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.updateOne(
      { email: 'demo@campus.edu' },
      { $set: { role: 'SystemAdmin' } }
    );
    console.log('Role fixed to SystemAdmin');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

fixRole();
