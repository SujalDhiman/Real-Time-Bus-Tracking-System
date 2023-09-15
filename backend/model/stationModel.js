const mongoose=require("mongoose")

const stationSchema=new mongoose.Schema({
    stationName:{
        type:String,
        unique:[true,"Station Name Already Registered Try Other Number"]
    },
    position:{
        type:[Number],
    },
},)

module.exports=mongoose.model("Station",stationSchema)