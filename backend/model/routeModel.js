import mongoose from "mongoose"

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

export const ROUTE=mongoose.model("Route",routeSchema)