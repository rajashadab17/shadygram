import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, Promise: null };
}

export async function connectToDatabase() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.Promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.Promise = mongoose
      .connect(MONGODB_URL, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.connection = await cached.Promise;
  } catch (e) {
    cached.Promise = null;
    throw e;
  }

  return cached.connection;
}