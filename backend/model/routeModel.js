const mongoose=require("mongoose")

const routeSchema=new mongoose.Schema({
    routeName:{
        type:String,
        unique:[true,"Route Name Already Registered Try Other Number"]
    },
    stations: [{
            ref: "Station",
            type:mongoose.Schema.Types.ObjectId
        }],
},)

module.exports=mongoose.model("Route",routeSchema)