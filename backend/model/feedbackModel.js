import mongoose from "mongoose"

const feedbackSchema=new mongoose.Schema({

    busNumber:{
        type:String,
        required:[true,"Bus Number Is Required"],
        lowercase:true,
    },
    ratings:{
        type:Number,
        required:[true,"Rating Is Required"],
        min:[1,"Minimum Rating should be atleast 1"],
        max:[5,"Maximum Rating Should be at max 5"],
        default:0
    },
    comments:{
        type:String,
        required:[true,"Comments are required"]
    }
})


export const FEEDBACK=mongoose.model("Feedback",feedbackSchema)