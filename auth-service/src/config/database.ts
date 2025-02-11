// src/config/database.ts
import mongoose from 'mongoose';



// Use MongoDB Atlas connection string
const dbURI = 'mongodb+srv://wave3jb1:7HLLLshcUZpF2Ij5@cluster0.6nfzb.mongodb.net/auth-userdb?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI); // No options needed for Mongoose 6+
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;


