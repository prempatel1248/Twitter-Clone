import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://prempatel1248:0BWJFj3tcNR9vSFV@cluster0.yj1tijw.mongodb.net/books_db?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}