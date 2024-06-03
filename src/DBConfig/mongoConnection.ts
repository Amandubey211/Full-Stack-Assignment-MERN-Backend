import mongoose from "mongoose";

import { DB_URL } from "../config";
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URL as string);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
