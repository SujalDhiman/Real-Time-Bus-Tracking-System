import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectToDB=async function (){
    try {
        console.log(`${process.env.MONGODB_URL}/${DB_NAME}`)
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("Database connected successfully")
        console.log("hello")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}   

export default connectToDB;