require("dotenv").config()
const mongoose=require("mongoose")


const connectToDb=async function (){

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("error in connecting database")
    }
}

module.exports=connectToDb