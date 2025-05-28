import mongoose from 'mongoose';
import { Mongodb_DB_Name, Mongodb_URI } from '@/config/env';

const dbConnect = async () => {
  try {
    // If already connected, return the connection
    if (mongoose.connection.readyState === 1) {
      // console.log('MongoDB is already connected');
      return mongoose.connection.getClient();
    }

    // Connect to the database
    const connection = await mongoose.connect(Mongodb_URI, {
      dbName: Mongodb_DB_Name,
    });
    // console.log('MongoDB connected successfully');
    return connection.connection.getClient();
  } catch (error) {
    // Handle any errors during the connection
    console.error('MongoDB connection error:', error);
    throw error; // Re-throw the error after logging it
  }
};

export default dbConnect;
