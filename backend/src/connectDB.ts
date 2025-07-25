import mongoose from "mongoose";
require('dotenv').config();

const uri = process.env.MONGODB_URI || '';

export async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}