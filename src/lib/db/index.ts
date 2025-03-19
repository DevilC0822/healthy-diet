'use server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: mongoose.Mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  try {
    const client = await mongoose.connect(MONGODB_URI!, {
      serverSelectionTimeoutMS: 60000, // 服务器选择超时
      socketTimeoutMS: 60000, // Socket 超时
      connectTimeoutMS: 60000, // 连接超时
    });
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}