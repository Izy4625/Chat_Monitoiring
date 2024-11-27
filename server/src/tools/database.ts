import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

export const connectToDatabase = async (): Promise<void> => {
    try {

        await mongoose.connect("mongodb+srv://pe05484:3q35v7g8gMi647wY@cluster0.lcpme.mongodb.net/ChatProject4" as string);
        console.log("Connected to mongoDB");
        
    } catch (error) {
        console.error("Failed to connect to databadse", error)
    }
};
