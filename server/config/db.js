import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-job-assistant', {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection error: ${error.message}`);
    console.warn(`⚠️ Running in standalone / fallback memory mode. Database persistence for history will be simulated.`);
  }
};
