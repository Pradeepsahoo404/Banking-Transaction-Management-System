import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database is connected successfully")
    }catch(err){
        console.log("Database is not connected")
        process.exit(1)
    }
}