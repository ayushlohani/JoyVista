import mongoose from "mongoose"
import { db_name } from "../constants.js"

const connectDb =async ()=>{
    try {
        const dbConnectInstance = await mongoose.connect(`mongodb+srv://lohaniayush97:ayush123@cluster0.pmjawtc.mongodb.net/${db_name}`);
        console.log(`DB Connected Succesfully at ${dbConnectInstance.connection.host}`)
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export {connectDb};