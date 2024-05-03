import mongoose from "mongoose"

const stationSchema=new mongoose.Schema({
    stationName:{
        type:String,
        unique:[true,"Station Name Already Registered Try Other Number"]
    },
    position:{
        type:[Number],
    },
},)

export const STATION=mongoose.model("Station",stationSchema)